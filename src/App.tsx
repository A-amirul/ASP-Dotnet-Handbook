import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { TocPage } from './components/TocPage';
import { SectionRenderer } from './components/SectionRenderer';
import { handbookData } from './data';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/toc" element={<TocPage />} />
          {handbookData.map((item) => (
            <Route key={item.id} path={`/${item.id}`} element={<SectionRenderer data={item} />} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
