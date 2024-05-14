import React, { useState } from 'react';
import axios from 'axios';

export const Group_list = () => {
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState('');

    const handleCreateGroup = (e : React.MouseEvent) => {
        e.preventDefault(); // Empêcher le rechargement de la page

        const token = localStorage.getItem("token");
        if (token) {
            axios.post('https://api.splitlynp.com/api/Teams', {
                name: groupName
            })
                .then(response => {
                // Traiter la réponse
                console.log(response.data);
                setShowModal(false); // Fermer le modal après la création
                setGroupName(''); // Réinitialiser le nom du groupe
                // Vous pouvez également rafraîchir la liste des groupes ici si nécessaire
            })
            .catch(error => {
                console.error('Erreur lors de la création du groupe:', error);
            });
        }
    };

    return (
        <>
            <h1>Group_list</h1>
            <button className={`btn btn-primary me-2 d-none d-lg-block`} onClick={() => setShowModal(true)}>
                <i className="bi bi-plus"></i>
            </button>

            {/* Modal Bootstrap pour la création de groupe */}
            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Créer un nouveau groupe</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <input type="text" className="form-control" placeholder="Nom du groupe" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Fermer</button>
                            <button type="button" className="btn btn-primary" onClick={handleCreateGroup}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
