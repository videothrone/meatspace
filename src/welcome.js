import React from "react";
import Registration from "./registration";
import { HashRouter, Route, Redirect } from "react-router-dom";
import Login from "./login";
import Logo from "./logo";

export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <div id="welcome">
                    <div id="welcome-logo">
                        <Logo />
                    </div>
                    <div id="meatspace-container">
                        <div id="meatspace">meatspace</div>
                        <div id="slogan">
                            Meet new faces in zero gravity spaces. ❤️
                        </div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Redirect path="*" to="/" />
                    </div>
                </div>
            </div>
        </HashRouter>
    );
}
