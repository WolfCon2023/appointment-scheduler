import { useDispatch } from 'react-redux'
import { setPageViewId } from '../../lib/store/slice/app-slice'

const Sidebar = () => {
  const dispatch = useDispatch()

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={() => dispatch(setPageViewId('dashboard'))}>
            <i className="mdi mdi-grid-large menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </a>
        </li>
        <li className="nav-item nav-category">Applications</li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
            <i className="menu-icon mdi mdi-account-circle-outline"></i>
            <span className="menu-title">CRM</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="ui-basic">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <a className="nav-link" href="#" onClick={() => dispatch(setPageViewId('addCustomer'))}>Add Customer</a></li>
              <li className="nav-item"> <a className="nav-link" href="#" onClick={() => dispatch(setPageViewId('viewCustomers'))}>View Customers</a></li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="collapse" href="#form-elements" aria-expanded="false" aria-controls="form-elements">
            <i className="menu-icon mdi mdi-card-text-outline"></i>
            <span className="menu-title">Appointments</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="form-elements">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item"><a className="nav-link" href="#">Schedule Appointment</a></li>
              <li className="nav-item"><a className="nav-link" href="#">View Appointments</a></li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="collapse" href="#charts" aria-expanded="false" aria-controls="charts">
            <i className="menu-icon mdi mdi-calendar"></i>
            <span className="menu-title">Calendar</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="charts">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <a className="nav-link" href="#">View Calendar</a></li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="collapse" href="#tables" aria-expanded="false" aria-controls="tables">
            <i className="menu-icon mdi mdi-format-list-bulleted"></i>
            <span className="menu-title">Tasks</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="tables">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <a className="nav-link" href="#">Manage Tasks</a></li>
              <li className="nav-item"> <a className="nav-link" href="#">Add Task</a></li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <a target="_blank" className="nav-link" href="https://mail.vitalinc.net/">
            <i className="menu-icon mdi mdi-email-outline"></i>
            <span className="menu-title">E-Mail</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar