/*
 * storage-provider.ts
 *
 * Created @author Antonio Carrasco Valero 201806031531
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */

import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {StorageKeys} from "./storage-keys";

@Injectable()
export class StorageProvider {

    constructor(
        public storage: Storage) {
        console.log("StorageProvider constructor");
    }



    retrieve_HAS_SEEN_TUTORIAL(): Promise<boolean> {
        return new Promise( (pheResolve, pheReject) => {

            this.retrieve_generic( StorageKeys.STORAGEKEY_HAS_SEEN_TUTORIAL)
                .then(
                    ( theResult) => {
                        const aResult = true === theResult; if(aResult){}/*CQT*/
                        return Promise.resolve( aResult);
                    },
                    ( theError) => {
                        console.log( "Error in StorageProvider retrieve_HAS_SEEN_TUTORIAL this.storage.get( StorageKeys.STORAGEKEY_HAS_SEEN_TUTORIAL)" + theError);
                        throw( theError);
                    }
                )
                /* // Example on how to leave room for other stuff to happen here
                   //   which may likely come to happen in the future, as the development progresses.
                .then(
                    ( theHasSeenTutorial) => {
                        return Promise.resolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_HASLOGGEDIN " + theError);
                        throw( theError);
                    }
                )
                */
                // Deal with final result, if needed.
                .then(
                    ( theHasSeenTutorial) => {
                        pheResolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_HASLOGGEDIN " + theError);
                        pheReject( theError);
                    }
                );
        });
    }



    persist_HAS_SEEN_TUTORIAL( theValue: boolean): Promise<boolean> {
        return new Promise( (pheResolve, pheReject) => {

            this.persist_generic( StorageKeys.STORAGEKEY_HAS_SEEN_TUTORIAL, theValue)
                .then(
                    ( theResult) => {
                        const aResult = true === theResult; if(aResult){}/*CQT*/
                        return Promise.resolve( aResult);
                    },
                    ( theError) => {
                        console.log( "Error in StorageProvider retrieve_HAS_SEEN_TUTORIAL this.storage.get( StorageKeys.STORAGEKEY_HAS_SEEN_TUTORIAL)" + theError);
                        throw( theError);
                    }
                )
                /* // Example on how to leave room for other stuff to happen here
                   //   which may likely come to happen in the future, as the development progresses.
                .then(
                    ( theHasSeenTutorial) => {
                        return Promise.resolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_HASLOGGEDIN " + theError);
                        throw( theError);
                    }
                )
                */
                // Deal with final result, if needed.
                .then(
                    ( theHasSeenTutorial) => {
                        pheResolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_HASLOGGEDIN " + theError);
                        pheReject( theError);
                    }
                );
        });
    }









    retrieve_AUTO_AUTHENTICATE_LOGIN(): Promise<boolean> {
        return new Promise( (pheResolve, pheReject) => {

            this.retrieve_generic( StorageKeys.STORAGEKEY_AUTO_AUTHENTICATE_LOGIN)
                .then(
                    ( theResult) => {
                        const aResult = true === theResult; if(aResult){}/*CQT*/
                        return Promise.resolve( aResult);
                    },
                    ( theError) => {
                        console.log( "Error in StorageProvider retrieve_AUTO_AUTHENTICATE_LOGIN this.storage.get( StorageKeys.STORAGEKEY_AUTO_AUTHENTICATE_LOGIN)" + theError);
                        throw( theError);
                    }
                )
                /* // Example on how to leave room for other stuff to happen here
                   //   which may likely come to happen in the future, as the development progresses.
                .then(
                    ( theHasSeenTutorial) => {
                        return Promise.resolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_AUTO_AUTHENTICATE_LOGIN " + theError);
                        throw( theError);
                    }
                )
                */
                // Deal with final result, if needed.
                .then(
                    ( theHasSeenTutorial) => {
                        pheResolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_AUTO_AUTHENTICATE_LOGIN " + theError);
                        pheReject( theError);
                    }
                );
        });
    }





    retrieve_generic( theKey: string): Promise<any> {
        if( !theKey) {
            const anErrorMsg = "Missing parameter theKey in StorageProvider retrieve_generic";
            console.log( anErrorMsg);
            throw anErrorMsg;
        }

        return new Promise( (pheResolve, pheReject) => {

            this.storage.get( theKey)
                .then(
                    ( theHasSeenTutorial) => {
                        return Promise.resolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        try {
                            console.log( "Error in StorageProvider retrieve_generic this.storage.get( theKey='" + theKey + "' )" + theError);
                        }
                        catch( anException) {
                        }
                        throw( theError);
                    }
                )
                // Example on how to leave room for other stuff to happen here
                //   which may likely come to happen in the future, as the development progresses.
                .then(
                    ( theValue) => {
                        try {
                            console.log( "StorageProvider retrieve_generic retrieved value=" + JSON.stringify( theValue));
                        }
                        catch( anException) {
                        }

                        return Promise.resolve( theValue);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_generic " + theError);
                        throw( theError);
                    }
                )
                // Deal with final result, if needed.
                .then(
                    ( theHasSeenTutorial) => {
                        pheResolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider retrieve_generic " + theError);
                        pheReject( theError);
                    }
                );
        });
    }







    persist_generic( theKey: string, theValue: any): Promise<any> {
        if( !theKey) {
            const anErrorMsg = "Missing parameter theKey in StorageProvider persist_generic";
            console.log( anErrorMsg);
            throw anErrorMsg;
        }

        if( typeof theValue === "undefined") {
            const anErrorMsg = "Missing parameter theValue in StorageProvider persist_generic";
            console.log( anErrorMsg);
            throw anErrorMsg;
        }

        try {
            console.log( "StorageProvider persist_generic theKey='" + theKey + "'  value=" + JSON.stringify( theValue));
        }
        catch( anException) {
        }


        return new Promise( (pheResolve, pheReject) => {

            this.storage.set( theKey, theValue)
                .then(
                    ( theHasSeenTutorial) => {
                        return Promise.resolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        try {
                            console.log( "Error in StorageProvider persist_generic this.storage.set()" + theError);
                        }
                        catch( anException) {
                        }
                        throw( theError);
                    }
                )
                // Example on how to leave room for other stuff to happen here
                //   which may likely come to happen in the future, as the development progresses.
                .then(
                    ( theHasSeenTutorial) => {
                        return Promise.resolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider persist_generic " + theError);
                        throw( theError);
                    }
                )
                // Deal with final result, if needed.
                .then(
                    ( theHasSeenTutorial) => {
                        pheResolve( theHasSeenTutorial);
                    },
                    ( theError) => {
                        // console.log( "Error in StorageProvider persist_generic " + theError);
                        pheReject( theError);
                    }
                );
        });
    }



}
