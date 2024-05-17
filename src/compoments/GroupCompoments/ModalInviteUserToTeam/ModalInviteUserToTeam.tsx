import React, {useEffect, useState} from 'react';
import {SearchUser} from "../../GroupCompoments/UserComponments/SearchUser/Search.tsx";
import {Invitation, User} from "../../../Types.ts";
import axios from "axios";
import {API_URL} from "../../../config.ts";
import {axiosUtils} from "../../../Utils/axiosUtils.ts";

export interface ModalInviteUserToTeamProps {
    showModal: boolean;
    handleCloseModal: () => void;
  groupId: string;
}

export const ModalInviteUserToTeam: React.FC<ModalInviteUserToTeamProps> = ({showModal, handleCloseModal, groupId}) => {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [invitationLink, setInvitationLink] = useState<Invitation | null>(null);
    const [copied, setCopied] = useState(false);
    const {ApiGet, ApiPost} = axiosUtils();
    const copyToClipboard = () => {
        console.log("Copier le lien d'invitation " + invitationLink?.url + " dans le presse-papiers.");
        navigator.clipboard.writeText(window.location.origin + "/group/join/" + invitationLink?.url as string);
        setCopied(true);

        // Réinitialiser l'état de 'copied' après quelques secondes
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };
    useEffect(() => {
        if (showModal) {
            ApiGet(`Invitations/${groupId}`)
                .then((response) => {
                    console.log("Résultats de la recherche:", response.data);
                    setInvitationLink(response.data.invitation); // Assurez-vous de stocker seulement l'invitation
                })
                .catch((error) => {
                    console.error("Erreur lors de la recherche:", error);
                });
        }
    }, [showModal, groupId]);

    useEffect(() => {
        if (searchResults.length > 0) {
            ApiPost(`Invitations/invite`, {
                TeamId: groupId,
                UserIds: searchResults.map((user) => user.id),
            })
                .then((response) => {
                    console.log("Invitation envoyée avec succès:", response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors de l'envoi de l'invitation:", error);
                });
        }
    }, [searchResults, groupId]);

    useEffect(() => {
        if (searchResults.length > 0) {
            console.log("Search results:", searchResults);

        }
    }, [searchResults]);

    return (
        <div>
            {showModal && (
                <div className="modal" tabIndex={-1} role="dialog" style={{display: 'block'}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Inviter un Utilisateur</h5>
                                <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <SearchUser isMutiple={true} setSearchResults={setSearchResults} textValue={"Inviter"}/>
                                <h3>Ou</h3>
                                <button type="button" className={`btn btn-primary`} onClick={copyToClipboard}
                                        disabled={copied}>
                                    {!copied ? (
                                        "Copier le lien d'invitation"
                                    ) : (
                                        "Copier dans le presse papier"
                                    )}
                                </button>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
