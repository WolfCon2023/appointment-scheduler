const Footer = () => {
  const year = new Date().getFullYear()


  return(
    <footer className="footer">
      <div className="d-sm-flex justify-content-center justify-content-sm-between">
        <span className="float-none float-sm-end d-block mt-1 mt-sm-0 text-center">Copyright &copy; {year}. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer