const VariableCallout = () => {
  return (
    <div className="card bg-primary card-rounded">
      <div className="card-body pb-0">
        <h4 className="card-title card-title-dash text-white mb-4">Status Summary</h4>
        <div className="row">
          <div className="col-sm-4">
            <p className="status-summary-ight-white mb-1">Closed Value</p>
            <h2 className="text-info">357</h2>
          </div>
          <div className="col-sm-8">
            <div className="status-summary-chart-wrapper pb-4">
              <canvas id="status-summary"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariableCallout