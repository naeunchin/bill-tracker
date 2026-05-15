import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8180/',
    realm: 'dmit2015-realm',
    clientId: 'dmit2015-jwt-client'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;