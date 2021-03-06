import React, { useEffect, useState } from "react";
//import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import {useParams} from "react-router-dom";

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import MapIcon from "../utils/mapIcon";
import api from "../services/api";

interface Orphanage {
  latitude: number;
  longitude: number; 
  name: string;
  sobre: string;
  instrucoes: string;
  horas_funcionamento: string;
  aberto_fds:boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface OrphanageParams{
  id:string;
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImgIndex,setActiveImgIndex ] = useState(0);

  console.log(orphanage);

  useEffect(() =>{
      api.get(`orfanatos/${params.id}`).then(response => {
          setOrphanage(response.data);
      })
  }, [params.id]);

  if(!orphanage){
    return <p>Carregando...</p>
  }

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImgIndex].url} alt={orphanage.name} />

          <div className="images">
            {orphanage.images.map((image, index) => {
             return (
                <button 
                  key={image.id} 
                  className={activeImgIndex === index ? 'active': ''} 
                  type="button"
                  onClick={() => {
                    setActiveImgIndex(index);
                  }}>
                  <img src={image.url} alt={orphanage.name}></img>
                </button>
             );
            })}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>
              {orphanage.sobre}
            </p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude,orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={MapIcon} position={[orphanage.latitude,orphanage.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>
              {orphanage.instrucoes}
            </p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                <p>
                  {orphanage.horas_funcionamento}
                </p>
              </div>
              {orphanage.aberto_fds ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                <FiInfo size={32} color="#FF6690" />
                Não atendemos <br />
                fim de semana
              </div>

              )}
            </div>
{/* 
            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}