const LargeStats = () => {
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="statistics-details d-flex align-items-center justify-content-between">
          <div>
            <p className="statistics-title">Bounce Rate</p>
            <h3 className="rate-percentage">32.53%</h3>
            <p className="text-danger d-flex"><i className="mdi mdi-menu-down"></i><span>-0.5%</span></p>
          </div>
          <div>
            <p className="statistics-title">Page Views</p>
            <h3 className="rate-percentage">7,682</h3>
            <p className="text-success d-flex"><i className="mdi mdi-menu-up"></i><span>+0.1%</span></p>
          </div>
          <div>
            <p className="statistics-title">New Sessions</p>
            <h3 className="rate-percentage">68.8</h3>
            <p className="text-danger d-flex"><i className="mdi mdi-menu-down"></i><span>68.8</span></p>
          </div>
          <div className="d-none d-md-block">
            <p className="statistics-title">Avg. Time on Site</p>
            <h3 className="rate-percentage">2m:35s</h3>
            <p className="text-success d-flex"><i className="mdi mdi-menu-down"></i><span>+0.8%</span></p>
          </div>
          <div className="d-none d-md-block">
            <p className="statistics-title">New Sessions</p>
            <h3 className="rate-percentage">68.8</h3>
            <p className="text-danger d-flex"><i className="mdi mdi-menu-down"></i><span>68.8</span></p>
          </div>
          <div className="d-none d-md-block">
            <p className="statistics-title">Avg. Time on Site</p>
            <h3 className="rate-percentage">2m:35s</h3>
            <p className="text-success d-flex"><i className="mdi mdi-menu-down"></i><span>+0.8%</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeStats