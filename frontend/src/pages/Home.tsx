import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div>
            <h1>Share Compute</h1>
            <Link to="/workflow">
                <button>New Workflow</button>
            </Link>
        </div>
    )
}

export default HomePage;