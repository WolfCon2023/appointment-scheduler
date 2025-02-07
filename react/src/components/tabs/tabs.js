const Tabs = () => {
  return (
    <div className="d-sm-flex align-items-center justify-content-between border-bottom">
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active ps-0" id="home-tab" data-bs-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="true">Overview</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="profile-tab" data-bs-toggle="tab" href="#audiences" role="tab" aria-selected="false">Audiences</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="contact-tab" data-bs-toggle="tab" href="#demographics" role="tab" aria-selected="false">Demographics</a>
        </li>
        <li className="nav-item">
          <a className="nav-link border-0" id="more-tab" data-bs-toggle="tab" href="#more" role="tab" aria-selected="false">More</a>
        </li>
      </ul>
      <div>
        <div className="btn-wrapper">
          <a href="#" className="btn btn-otline-dark align-items-center"><i className="icon-share"></i> Share</a>
          <a href="#" className="btn btn-otline-dark"><i className="icon-printer"></i> Print</a>
          <a href="#" className="btn btn-primary text-white me-0"><i className="icon-download"></i> Export</a>
        </div>
      </div>
    </div>
  )
}

export default Tabs