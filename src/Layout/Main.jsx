import { Outlet } from "react-router-dom"
import { NavBar } from "../Pages/Home/NavBar"
import MyFooter from "../Shared/MyFooter"

export const Main = () => {
  return (
    <div>
        <NavBar></NavBar>
        <Outlet></Outlet>
        <MyFooter></MyFooter>
              
    </div>
  )
}
