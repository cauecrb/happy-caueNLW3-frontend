import React, { FormEvent, useState, ChangeEvent} from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';

import {  FiPlus } from "react-icons/fi";


import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";


export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({latitude: 0, longitude: 0});

  const [name, setName] = useState('');
  const [sobre, setSobre] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [horas_funcionamento, setHorasFuncionamento] = useState('');
  const [aberto_fds, setAbertoFds] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent){
    const {lat, lng} = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    const {latitude, longitude} = position;

    const data = new FormData();

    data.append('name', name);
    data.append('sobre', sobre);
    data.append('instrucoes', instrucoes);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('horas_funcionamento', horas_funcionamento);
    data.append('aberto_fds', String(aberto_fds));
    data.append('horas_funcionamento', horas_funcionamento);

    images.forEach(image => {
      data.append('images', image)
    })

    await api.post('orfanatos', data)

    alert('cadastro realizado com sucesso');

    history.push('/app');
  }

  function handleSelectImgs(event: ChangeEvent<HTMLInputElement>){
    if (!event.target.files){
      return;
    }

    const imgPreview = Array.from(event.target.files);

    setImages(imgPreview);
    const imgPreviewPre = imgPreview.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(imgPreviewPre);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />


      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-27.5969,-48.5495]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 
              ?  (<Marker 
                    interactive={false} 
                    icon={mapIcon} 
                    position={[
                      position.latitude,
                      position.longitude
                    ]} 
                  />) 
              : null }

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={name} 
                onChange={
                  event => setName(event.target.value)
                  } 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="name" 
                maxLength={300} 
                value={sobre} 
                onChange={
                  event => setSobre(event.target.value)
                  }
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
              {previewImages.map(image=>{
                return (
                  <img key={image} src={image} alt={name}/>
                )
              })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
 
              </div>
              <input multiple onChange={handleSelectImgs} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={instrucoes} 
                onChange={
                  event => setInstrucoes(event.target.value)
                  }
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input 
                id="opening_hours" 
                value={horas_funcionamento} 
                onChange={
                  event => setHorasFuncionamento(event.target.value)
                  }
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={
                    aberto_fds ? 
                    'active' : ''}
                  onClick={() => setAbertoFds(true)}
                  >
                    Sim
                </button>
                <button 
                  type="button"
                  className={
                    !aberto_fds ? 
                    'active' : ''}
                    onClick={() => setAbertoFds(false)}
                  >
                    Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
