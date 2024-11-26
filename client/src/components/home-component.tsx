const HomeComponent = () => {
  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Leaning system</h1>
            <p className="col-md-8 fs-4">
              This system uses React.js as the frontend framework and Node.js
              with MongoDB as the backend server. This type of project is known
              as a MERN project, one of the most popular approaches for building
              modern websites.
            </p>
            <a className="btn btn-primary btn-lg" type="button" href="/login">
              Login to start
            </a>
          </div>
        </div>

        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>As a student</h2>
              <p>
                Students can register for their favorite courses. Please note
                that this website is for practice purposes only and does not
                require any personal information, such as credit card numbers.
              </p>
              <a className="btn btn-outline-light" type="button" href="/login">
                Login, or register
              </a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>As a intructor</h2>
              <p>
                You can also register as an instructor and start creating online
                courses. Again, this website is for practice purposes only; do
                not provide any personal information, such as credit card
                numbers.
              </p>
              <a
                className="btn btn-outline-secondary"
                type="button"
                href="/login"
              >
                Start creating your courses today!
              </a>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2024 Lawrence Wu
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
