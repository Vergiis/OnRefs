import { DropdownCanvas } from "./DropdownCanvas"

export function NavBar(){
    return(
        <nav className="navbar navbar-icon-top navbar-expand-lg fixed-top navbar-dark bg-dark">
            <a className="navbar-brand" href="/">
                <img src="\img\logo.png" alt="Logo" height="38" />
            </a>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                    <DropdownCanvas />
                    <li className="nav-item">
                        <a className="btn btn-light navbar-text" id="saveCanvas" >Save</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link" id="signIn" >Sign In</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}