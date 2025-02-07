import Dashboard from "../apps/dashboard/dashboard"
import AddCustomer from "../apps/crm/add-customer"
import ViewCustomers from "../apps/crm/view-customers"

const viewMap = {
  'dashboard': <Dashboard />,
  'addCustomer': <AddCustomer />,
  'viewCustomers': <ViewCustomers />
}

export default viewMap