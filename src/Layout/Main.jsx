import { Outlet } from "react-router-dom"
import Footer from "../Shared/Footer"
import { NavBar } from "../Pages/Home/NavBar"

export const Main = () => {
  return (
    <div>
        <NavBar></NavBar>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}
