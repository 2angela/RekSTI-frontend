import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "root/redux/store";
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
