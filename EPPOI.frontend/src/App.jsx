import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import ArticlesList from './pages/ArticlesList';
import ArticleDetail from './pages/ArticleDetail';
import ArtCultureList from './pages/ArtCultureList';
import ArtCultureDetail from './pages/ArtCultureDetail';
import EatDrinkList from './pages/EatDrinkList';
import EatDrinkDetail from './pages/EatDrinkDetail';
import EntertainmentList from './pages/EntertainmentList';
import EntertainmentDetail from './pages/EntertainmentDetail';
import EventsList from './pages/EventsList';
import EventsDetail from './pages/EventsDetail';
import RoutesList from './pages/RoutesList';
import RoutesDetail from './pages/RoutesDetail';
import OrganizationsList from './pages/OrganizationsList';
import OrganizationsDetail from './pages/OrganizationsDetail';
import SleepAccommodationList from './pages/SleepAccommodationList';
import SleepAccommodationDetail from './pages/SleepAccommodationDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ArticlesList" element={<ArticlesList />} />
        <Route path="/ArticleDetail/:id" element={<ArticleDetail />} />
        <Route path="/ArtCultureList" element={<ArtCultureList />} />
        <Route path="/ArtCultureDetail/:id" element={<ArtCultureDetail />} />
        <Route path="/EatDrinkList" element={<EatDrinkList />} />
        <Route path="/EatDrinkDetail/:id" element={<EatDrinkDetail />} />
        <Route path="/EntertainmentList" element={<EntertainmentList />} />
        <Route path="/EntertainmentDetail/:id" element={<EntertainmentDetail />} />
        <Route path="/EventsList" element={<EventsList />} />
        <Route path="/EventsDetail/:id" element={<EventsDetail />} />
        <Route path="/RoutesList" element={<RoutesList />} />
        <Route path="/RoutesDetail/:id" element={<RoutesDetail />} />
        <Route path="/OrganizationsList" element={<OrganizationsList />} />
        <Route path="/OrganizationsDetail/:id" element={<OrganizationsDetail />} />
        <Route path="/SleepAccommodationList" element={<SleepAccommodationList />} />
        <Route path="/SleepAccommodationDetail/:id" element={<SleepAccommodationDetail />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;