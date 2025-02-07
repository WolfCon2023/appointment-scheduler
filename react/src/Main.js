import { useEffect, useState } from 'react'
import './Main.css'
import Navbar from './components/navbar/navbar'
import Sidebar from './components/sidebar/sidebar'
import Dashboard from './apps/dashboard/dashboard'
import AddCustomer from './apps/crm/add-customer'
import { useSelector } from 'react-redux'
import { selectApp } from './lib/store/slice/app-slice'
import viewMap from './lib/view-map'

const Main = () => {
  const { pageViewId } = useSelector(selectApp)
  const [currentPage, setCurrentPage] = useState(<Dashboard />)

  useEffect(() => {
    setCurrentPage(viewMap[pageViewId])    
  }, [pageViewId])
  
  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        {currentPage}
      </div>
    </div>
  );
}

export default Main;
