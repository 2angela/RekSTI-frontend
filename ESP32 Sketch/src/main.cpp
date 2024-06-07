#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include "time.h"
#include <Adafruit_I2CDevice.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// SSID dan password wifi
#define WIFI_SSID "Merkuri 511A"
#define WIFI_PASSWORD "razanrafan"

// Firebase project API Key
#define API_KEY "AIzaSyDIBZXldOBfkuccLupVWz30v1as-TVG5QI"

// Autentikasi untuk realtime database Firebase
#define USER_EMAIL "penghuni@gmail.com"
#define USER_PASSWORD "penghuni123"

// Untuk connect ke realtime database Firebase
#define DATABASE_URL "https://reksti-6bdec-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Pin buzzer
#define BUZZER_PIN 2

// Pin magnetic switch
#define DOOR_SENSOR_PIN  19

// Konstan untuk pengukuran tingkat suara
#define ADC_PIN 32                    // ADC pin connected to the MAX4466 output
#define ADC_RESOLUTION 12             // ADC resolution in bits
#define ADC_REFERENCE_VOLTAGE 3.3     // ADC reference voltage in volts

// Konstan untuk konversi voltage ke dB
#define SOUND_REF_VOLTAGE 0.775       // Reference voltage for sound level calculation (volts)
#define SOUND_SENSITIVITY 77          // Sensitivity of the MAX4466 module in mV/dB

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// USER UID
String uid;

// Database main path (to be updated in setup with the user UID)
String databasePath;

// Path untuk tiap variabel
String kamarPath = "/rooms_name";
String tempPath = "/current_temp";
String soundPath = "/current_noise";
String timePath = "/timestamp";
String isExceedTempPath = "/isExceedTemp";
String isExceedNoisePath = "/isExceedNoise";
String isDoorOpenPath = "/isDoorOpen";
String idPath = "/id";
String maxNoisePath = "/max_noise";
String maxTempPath = "/max_temp";

// Batas toleransi
float batasTemp = 25;
float batasNoise = 110;

// Parent Node (to be updated in every loop)
String parentPath;

int doorState;
String timestamp;

const char* ntpServer = "pool.ntp.org";

// BMP280 sensor
Adafruit_BMP280 BMP; // I2C
float temperature;
float pressure;

// Timer (mengirim hasil pengukuran sensor setiap 15 detik)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 15000;

// Initialize BMP280
void initBMP(){
  if (!BMP.begin(0x76)) {
    Serial.println("Could not find a valid BMP280 sensor, check wiring!");
    while (1);
  }
}

// Initialize WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println();
}

// Function untuk dapet waktu
String getTime() {
  time_t now;
  struct tm timeinfo;

  // Get the current time
  time(&now);

  // Convert to local time structure
  localtime_r(&now, &timeinfo);

  // Add 7 hours to the current time
  timeinfo.tm_hour += 7;

  // Handle overflow of hours
  if (timeinfo.tm_hour >= 24) {
    timeinfo.tm_hour -= 24;
    timeinfo.tm_mday += 1;
  }

  // Adjust for month/year changes if needed
  mktime(&timeinfo);

  // Format the time into a string
  char buffer[80];
  strftime(buffer, 80, "%Y-%m-%d %H:%M:%S", &timeinfo);

  return String(buffer);
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(DOOR_SENSOR_PIN, INPUT_PULLUP);

  // Initialize BMP280 sensor
  initBMP();
  initWiFi();
  configTime(0, 0, ntpServer);

  // API key (required)
  config.api_key = API_KEY;

  // User sign in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Realtime database URL (required)
  config.database_url = DATABASE_URL;

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  config.token_status_callback = tokenStatusCallback; //addons/TokenHelper.h

  config.max_token_generation_retry = 5;

  Firebase.begin(&config, &auth);

  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);

  // Database path
  databasePath = "rooms/rooms_1";
}

void loop() {
  // Mengirim hasil pengukuran oleh sensor
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Waktu saat ini
    timestamp = getTime();
    Serial.print("time: ");
    Serial.println(timestamp);

    parentPath = databasePath + "/";

    // Baca nilai analog dari mic
    int adcValue = analogRead(ADC_PIN);
    // Konvert nilai analog ke voltage
    float voltage = (adcValue * (3.3 / 4095.0)) + 0.01;

    float soundLevel = 0;
    char formattedSoundLevel[10];

    if (voltage < 0) {
      Serial.println("Voltage too low to calculate sound level.");
    } else {
      // Konversi ke desibel
      soundLevel = 30 * log10(voltage / SOUND_REF_VOLTAGE) + SOUND_SENSITIVITY; 
      dtostrf(soundLevel, 7, 2, formattedSoundLevel);
      // Print ke serial monitor
      Serial.print("Sound Level (dB): ");
      Serial.println(formattedSoundLevel);
    }

    float temperature = BMP.readTemperature();
    bool isExceedTemp = temperature < batasTemp;
    bool isExceedNoise = soundLevel > batasNoise;

    doorState = digitalRead(DOOR_SENSOR_PIN); // read state
    bool isDoorOpen = (doorState == HIGH);

    digitalWrite(BUZZER_PIN, LOW);
    if (isExceedTemp || isExceedNoise) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(1000);
      digitalWrite(BUZZER_PIN, LOW);
    }

    // Debugging info before sending data
    Serial.println("Sending data to Firebase...");
    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("Sound Level: ");
    Serial.println(formattedSoundLevel);
    Serial.print("Door State: ");
    Serial.println(isDoorOpen ? "Open" : "Closed");

    // Send data to Firebase
    float floatedSoundLevel = atof(formattedSoundLevel);
    if (Firebase.RTDB.setFloat(&fbdo, parentPath + soundPath, floatedSoundLevel)) {
      Serial.println("Sound Level sent successfully");
    } else {
      Serial.print("Failed to send Sound Level: ");
      Serial.println(fbdo.errorReason());
    }
    
    if (Firebase.RTDB.setFloat(&fbdo, parentPath + tempPath, temperature)) {
      Serial.println("Temperature sent successfully");
    } else {
      Serial.print("Failed to send Temperature: ");
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.RTDB.setString(&fbdo, parentPath + idPath, "rooms_1")) {
      Serial.println("ID sent successfully");
    } else {
      Serial.print("Failed to send ID: ");
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.RTDB.setBool(&fbdo, parentPath + isDoorOpenPath, isDoorOpen)) {
      Serial.println("Door State sent successfully");
    } else {
      Serial.print("Failed to send Door State: ");
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.RTDB.setInt(&fbdo, parentPath + maxNoisePath, 130)) {
      Serial.println("Max Noise sent successfully");
    } else {
      Serial.print("Failed to send Max Noise: ");
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.RTDB.setInt(&fbdo, parentPath + maxTempPath, 23)) {
      Serial.println("Max Temp sent successfully");
    } else {
      Serial.print("Failed to send Max Temp: ");
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.RTDB.setString(&fbdo, parentPath + kamarPath, "Kamar 1")) {
      Serial.println("Room Name sent successfully");
    } else {
      Serial.print("Failed to send Room Name: ");
      Serial.println(fbdo.errorReason());
    }

    // Uncomment if you want to send the timestamp
    /*
    if (Firebase.RTDB.setString(&fbdo, parentPath + timePath, timestamp)) {
      Serial.println("Timestamp sent successfully");
    } else {
      Serial.print("Failed to send Timestamp: ");
      Serial.println(fbdo.errorReason());
    }
    */
  }
}
