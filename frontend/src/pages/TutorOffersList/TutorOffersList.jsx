import { useEffect, useState } from "react";
import "./TutorOffersList.css";

export default function TutorOffersList() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/tutors")
      .then(res => res.json())
      .then(setOffers)
      .catch(err => console.error("Error al cargar ofertas:", err));
  }, []);

  return (
    <div className="tutors-container container mt-5">
      <h2>🎓 Profesores disponibles</h2>
      {offers.map(offer => (
        <div key={offer._id} className="tutor-card">
          <h5>{offer.subject} — <span className="text-muted">{offer.userId.name}</span></h5>
          <p>{offer.description}</p>
          <p><strong>Precio:</strong> {offer.price}€/h</p>
          <p><strong>Modalidad:</strong> {offer.modality}</p>
          <p><strong>Disponibilidad:</strong> {offer.availability}</p>
          <a href={`mailto:${offer.userId.email}`} className="btn btn-sm">Contactar</a>
        </div>
      ))}
    </div>
  );
}
