import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminAddMovie from "./pages/admin/AdminAddMovie";
import AdminEditMovie from "./pages/admin/AdminEditMovie";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminPayments from "./pages/admin/AdminPayments";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Watch from "./pages/Watch";
import Category from "./pages/Category";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Subscription from "./pages/Subscription";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/movies/:id" element={<MovieDetails />} />

        <Route path="/watch/:id" element={<Watch />} />

        <Route path="/category/:category" element={<Category />} />

        <Route path="/movies" element={<SearchResults />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/subscription" element={<Subscription />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/movies" element={<AdminMovies />} />

          <Route path="/admin/movies/add" element={<AdminAddMovie />} />

          <Route path="/admin/movies/edit/:id" element={<AdminEditMovie />} />

          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="/admin/subscribers" element={<AdminSubscribers />} />

          <Route path="/admin/payments" element={<AdminPayments />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
