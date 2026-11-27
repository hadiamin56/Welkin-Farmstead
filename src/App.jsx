import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { ContentProvider } from './content/ContentContext.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Orchard from './pages/Orchard.jsx';
import Aquaculture from './pages/Aquaculture.jsx';
import Livestock from './pages/Livestock.jsx';
import Visits from './pages/Visits.jsx';
import { Seasons, Careers, Gallery, Contact, NotFound } from './pages/Others.jsx';

// The admin panel is its own chunk: visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      <Route element={<ContentProvider><Layout /></ContentProvider>}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/orchard" element={<Orchard />} />
        <Route path="/aquaculture" element={<Aquaculture />} />
        <Route path="/livestock" element={<Livestock />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/seasons" element={<Seasons />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
