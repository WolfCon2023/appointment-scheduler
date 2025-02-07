import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPageViewId } from '../../lib/store/slice/app-slice'
import { getCustomers, selectCustomers } from '../../lib/store/slice/customers-slice'

const ViewCustomers = () => {
  const dispatch = useDispatch()
  const { customerList } = useSelector(selectCustomers)

  useEffect(() => {
    dispatch(getCustomers())
  }, [])


  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="home-tab">
              <div className="d-sm-flex align-items-center justify-content-between border-bottom">
                <ul className="nav nav-tabs" role="tablist">
                </ul>
                <div>
                  <div className="btn-wrapper">
                    <a href="#" className="btn btn-primary text-white me-0" onClick={() => dispatch(setPageViewId('addCustomer'))}><i className="mdi mdi-account-plus"></i> Add new customer</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 grid-margin" />
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Customers</h4>
                <div className="row">
                  <div className="col-12">
                    <div className="table-responsive">
                      <div id="order-listing_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                        <div className="row">
                          <div className="col-sm-12 col-md-6">
                            <div className="dataTables_length" id="order-listing_length">
                              <label>Show
                                <select name="order-listing_length" aria-controls="order-listing"
                                  className="custom-select custom-select-sm form-control">
                                  <option value="5">5</option>
                                  <option value="10">10</option>
                                  <option value="15">15</option>
                                  <option value="-1">All</option>
                                </select>
                                entries</label>
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-6">
                            <div id="order-listing_filter" className="dataTables_filter"><label><input type="search"
                              className="form-control" placeholder="Search" aria-controls="order-listing" /></label></div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12">
                            <table id="order-listing" className="table dataTable no-footer"
                              aria-describedby="order-listing_info">
                              <thead>
                                <tr>
                                  <th className="sorting" tabIndex="0" aria-controls="order-listing" rowSpan="1" colSpan="1"
                                    aria-label="Purchased On: activate to sort column ascending" style={{ width: '122.031px' }}>
                                    First Name</th>
                                  <th className="sorting" tabIndex="0" aria-controls="order-listing" rowSpan="1" colSpan="1"
                                    aria-label="Customer: activate to sort column ascending" style={{ width: '89.4062px' }}>
                                    Last Name</th>
                                  <th className="sorting" tabIndex="0" aria-controls="order-listing" rowSpan="1" colSpan="1"
                                    aria-label="Ship to: activate to sort column ascending" style={{ width: '65.4531px' }}>
                                    Email</th>
                                  <th className="sorting" tabIndex="0" aria-controls="order-listing" rowSpan="1" colSpan="1"
                                    aria-label="Base Price: activate to sort column ascending" style={{ width: '92.9375px' }}>
                                    Phone Number</th>
                                  <th className="sorting" tabIndex="0" aria-controls="order-listing" rowSpan="1" colSpan="1"
                                    aria-label="Purchased Price: activate to sort column ascending"
                                    style={{ width: '140.266px' }}>Product Line</th>
                                  <th className="sorting" tabIndex="0" aria-controls="order-listing" rowSpan="1" colSpan="1"
                                    aria-label="Status: activate to sort column ascending" style={{ width: '76.7656px' }}>Notes
                                  </th>
                                  <th className="sorting" tabIndex="0" aria-controls="order-listing" rowSpan="1" colSpan="1"
                                    aria-label="Actions: activate to sort column ascending" style={{ width: '73.2188px' }}>
                                    Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {customerList.map((item, i) => (
                                    <tr className="odd" key={i}>
                                      <td>{item.firstName}</td>
                                      <td>{item.lastName}</td>
                                      <td>{item.email}</td>
                                      <td>{item.phoneNumber}</td>
                                      <td>{item.productLine}</td>
                                      <td><i style={{ color: 'green', fontSize: '24px', cursor: 'pointer' }} className="mdi mdi-note"></i></td>
                                      <td>
                                        <button className="btn btn-outline-primary">View</button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12 col-md-5">
                            <div className="dataTables_info" id="order-listing_info" role="status" aria-live="polite">Showing 1
                              to 10 of 10 entries</div>
                          </div>
                          <div className="col-sm-12 col-md-7">
                            <div className="dataTables_paginate paging_simple_numbers" id="order-listing_paginate">
                              <ul className="pagination">
                                <li className="paginate_button page-item previous disabled" id="order-listing_previous"><a
                                  aria-controls="order-listing" aria-disabled="true" role="link" data-dt-idx="previous"
                                  tabIndex="-1" className="page-link">Previous</a></li>
                                <li className="paginate_button page-item active"><a href="#" aria-controls="order-listing"
                                  role="link" aria-current="page" data-dt-idx="0" tabIndex="0" className="page-link">1</a>
                                </li>
                                <li className="paginate_button page-item next disabled" id="order-listing_next"><a
                                  aria-controls="order-listing" aria-disabled="true" role="link" data-dt-idx="next"
                                  tabIndex="-1" className="page-link">Next</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCustomers