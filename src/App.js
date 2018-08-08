import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import styled, { injectGlobal } from 'styled-components';
import Pusher from 'pusher-js';
import Tester from './Tester';

injectGlobal`
   body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      color: #333;
   }
`;

const socket = new Pusher('507f085c62c12711175d', {
   cluster: 'mt1',
   encrypted: true
 });

const channel = socket.subscribe('my-channel');
channel.bind('my-event', function(data) {
   console.log(data);
});

const color = '#5b40b3';

const Nav = styled(NavLink)`
   padding: 10px;
   display: inline-block;
   text-decoration: none;
   color: ${color};
   border-bottom: 3px solid ${color};
   border-width: 0px;
   &:hover {
      background-color: #f0f0f0;
   }
`;

const Main = styled.main`
   padding: 10px;
`;

const Header = styled.header`
   background-color: #f6f6f6;
   border-bottom: 1px solid #eee;
`;

const Input = styled.input`
   font: inherit;
   color: inherit;
   padding: 4px;
   outline-color: ${color};
   outline-width: thin;
   /* &:focus {
      border-color: ${color};
   } */
`;

const routes = [
   { id: 'industry', name: 'Industries', component: Industries },
   { id: 'user', name: 'Users', component: () => 'Users' },
   { id: 'city', name: 'Cities', component: () => 'Cities' },
];

const data = Array(10).fill().map((_, i) => (
   { id: i, name: 'kwa' }
));

function Industries() {
   return (
      <div>
         {Array(10).fill().map((_, i) => (
            <NavLink key={i} to={`/industries/${i}`}>{i}</NavLink>
         ))}
      </div>
   )
}

function Industry(props) {
   return JSON.stringify(props);
}

class App extends Component {
   componentDidMount() {
      // constlocalStorage.setItem('a', 1);
      // document.cookie = "'a':'1'"
      // navigator.cookieEnabled 
   }
  render() {
    return (
      <Router>
         <div>
            <Route path="/a" component={() => 'ahha'} />
            <Route path="/" strict component={(a) => {
               if (a.location.pathname.startsWith('/a')) return null;
               return (
               <div>
                  <Header>
                     {routes.map(route => (
                        <Nav key={route.id} to={`/${route.id}`} activeStyle={{
                           borderWidth: '3px',
                        }}>{route.name}</Nav>
                     ))}
                  </Header>
                  <Main>
                     {routes.map(route => (
                        <Route key={route.id} path={`/${route.id}`} component={route.component} />
                     ))}
                     <Route path="/industries/:id" component={Industry} />
                     <Input />
                  </Main>
               </div>
            )}} />
            <Tester />
         </div>
      </Router>
    );
  }
}

export default App;
