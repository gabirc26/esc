import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import "./styles/main.css"

function Index() {

  return (
    <div>
      <Header />
      <Outlet /><br />
      <Footer />
    </div>
  )
}

export default Index
