// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "./pages/Login";
// import Body from "./Body";
// import Profile from "./pages/Profile";
// import { Provider } from "react-redux";
// import appStore from "./utils/appStore";
// import Feed from "./pages/Feed";
// import Connection from "./pages/Connection";
// import ReviewRequest from "./pages/ReviewRequest";

// function App() {
//   return (
//     <>
//       <Provider store={appStore}>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/" element={<Body />}>
//               <Route path="/feed" element={<Feed />} />
//               <Route path="/profile" element={<Profile />} />
//               <Route path="/connection" element={<Connection />} />
//               <Route path="/request" element={<ReviewRequest />} />
//               <Route path="/logout" element={<></>} />
//             </Route>
//           </Routes>
//         </BrowserRouter>
//       </Provider>
//     </>
//   );
// }

// export default App;

// App.js
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import { Provider, useSelector } from "react-redux";
// import Login from "./pages/Login";
// import Body from "./Body";
// import Profile from "./pages/Profile";
// import Feed from "./pages/Feed";
// import Connection from "./pages/Connection";
// import ReviewRequest from "./pages/ReviewRequest";
// import appStore from "./utils/appStore";

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const user = useSelector((store) => store.user);

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // Home Redirect Component
// const HomeRedirect = () => {
//   const user = useSelector((store) => store.user);

//   if (user) {
//     return <Navigate to="/feed" replace />;
//   }

//   return <Navigate to="/login" replace />;
// };

// // App Router Component (inside Provider)
// const AppRouter = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Root path - redirects based on authentication */}
//         <Route path="/" element={<HomeRedirect />} />

//         {/* Login route */}
//         <Route path="/login" element={<Login />} />

//         {/* Protected routes with Body layout */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Body />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="feed" element={<Feed />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="connection" element={<Connection />} />
//           <Route path="request" element={<ReviewRequest />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// };

// // Main App Component
// function App() {
//   return (
//     <Provider store={appStore}>
//       <AppRouter />
//     </Provider>
//   );
// }

// export default App;

// App.jsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Connection from "./pages/Connection";
import ReviewRequest from "./pages/ReviewRequest";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connection" element={<Connection />} />
            <Route path="request" element={<ReviewRequest />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
