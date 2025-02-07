import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPageViewId } from '../../lib/store/slice/app-slice'
import { addCustomer } from '../../lib/store/slice/customers-slice'

const AddCustomer = () => {
  const dispatch = useDispatch()
  const [customer, setCustomer] = useState({productLine: 'Agile Consulting'})

  const submitForm = () => {
    dispatch(addCustomer(customer))
    dispatch(setPageViewId('viewCustomers'))
  }

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title card-title-dash">Customer Relationship Management (CRM)</h4>
                <h5 className="card-subtitle card-subtitle-dash">Add Customer</h5>
                <form className="form-sample material-form">
                  <div className="col-12 grid-margin" />
                  <p className="card-description">
                    Personal info
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input type="text" onChange={evt => setCustomer({...customer, firstName: evt.target.value})} />
                        <label for="input" className="control-label">First Name*</label><i className="bar"></i>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group row">
                        <input type="text" onChange={evt => setCustomer({...customer, lastName: evt.target.value})} />
                        <label for="input" className="control-label">Last Name*</label><i className="bar"></i>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input type="text" onChange={evt => setCustomer({...customer, email: evt.target.value})} />
                        <label for="input" className="control-label">Business Email*</label><i className="bar"></i>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group row">
                        <input type="text" onChange={evt => setCustomer({...customer, phoneNumber: evt.target.value})} />
                        <label for="input" className="control-label">Phone Number</label><i className="bar"></i>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <select onChange={evt => setCustomer({...customer, productLine: evt.target.value})} >
                          <option>Agile Consulting</option>
                          <option>Business Consulting</option>
                          <option>Network Consulting</option>
                          <option>Software Consulting</option>
                        </select>
                        <label for="select" className="control-label">Product Lines</label><i className="bar"></i>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <textarea type="text" style={{ height: '150px' }} onChange={evt => setCustomer({...customer, notes: evt.target.value})} />
                        <label for="input" className="control-label">Interaction Notes</label><i className="bar"></i>
                      </div>
                    </div>
                  </div>
                    <button type="submit" className="btn btn-primary me-2" onClick={() => submitForm()}>Submit</button>
                    <button className="btn btn-light" onClick={() => dispatch(setPageViewId('viewCustomers'))}>Cancel</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCustomer