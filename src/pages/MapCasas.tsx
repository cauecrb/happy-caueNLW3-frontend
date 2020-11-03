import React, {useEffect, useState} from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import {Link} from 'react-router-dom';
import {Map, TileLayer, Marker, Popup } from 'react-leaflet';

import localImg from '../images/Local.svg'

import '../styles/pages/map-casas.css'
import MapIcon from '../utils/mapIcon';
import api from '../services/api';

interface Orphanage {
    id: number;
    latitude: number;
    longitude: number; 
    nome: string;
}

function OrphanagesMap (){
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    console.log(orphanages);

    useEffect(() =>{
        api.get('orfanatos').then(response => {
            setOrphanages(response.data);
        })
    }, []);

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={localImg} alt="Happy"/>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Florianopolis</strong>
                    <span>Santa Catarina</span>
                </footer>
            </aside>
            
            <Map 
                center={[-27.592808,-48.5606077]}
                zoom={15}
                style={{width: '100%', height: '100%'}}            
            >
                {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                <TileLayer 
                    url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} 
                />
            {orphanages.map(orphanage => {
                return(
                    <Marker
                    icon = {MapIcon}
                    position={[orphanage.latitude, orphanage.longitude]}
                    key={orphanage.id}
                >
                    <Popup closeButton={false} minWidth={240} maxWidth={240}className="map-popup">
                        Casa das Criaças
                        <Link to={`/orphanages/${orphanage.id}`}>
                            <FiArrowRight size={20} color="#FFF"/>
                        </Link>
                    </Popup>
                </Marker>
                )
            })}
            </Map> 

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
        );
}

export default OrphanagesMap;