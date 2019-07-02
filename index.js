// index.js
import express from 'express';
import serverless from 'serverless-http';
import playground from 'graphql-playground-middleware-express';
import { ApolloServer, gql } from 'apollo-server-express';

import getCrpsCompany from './resolvers/crps/company_mock';
import getTaxisCompany from './resolvers/taxis/company';
import getTaxisCompanyStatements from './resolvers/taxis/statements';
import getTaxisCompanyStatement from './resolvers/taxis/statement';

const typeDefs = gql`
  type CrpsCompany {
    companyId: String,
    companyRegistrationId: String,
    companyRegistrationChangeId: String,
    companyName: String,
    companyShortName: String,
    companyType: String,
    businessSectorCode: String,
    businessSectorName: String,
    companyHeadquartersAddressStreet: String,
    companyHeadquartersAddressCity: String,
    companyPostDeliveryAddressStreet: String,
    companyPostDeliveryAddressCity: String,
    companyTotalCapital: String,
    companyRegistrationDate: String,
    companyRegistrationChangeDate: String,
    companyStatus: String,
    companyOfficials: [CrpsCompanyOfficial]
  }

  type CrpsCompanyOfficial {
    firstName: String,
    lastName: String,
    responsibility: String,
    equity: String,
    roles: [CrpsOfficialRole]
  }

  type CrpsOfficialRole {
    key: String,
    description: String
  }

  "Centralni Registar Privrednih Subjekata"
  type Crps {
    institution: String,
    version: String,
    company(companyId: String!): CrpsCompany
  }

  type TaxisCompany {
    companyId: String,
    companyName: String,
    companyAddress: String,
    businessSectorCode: String,
    businessSectorName: String,
    taxArea: String,
    companyRegistrationDate: String,
    companyRegistrationId: String,
    companyRegistrationInstitution: String,
    companyRegisteredForVat: String,
    companyVatRegistrationDate: String,
    companyVatRegistrationId: String
    financialStatements: [FinancialStatement]
  }

  type FinancialStatement {
    year: String,
    statementId: String,
    details: FinancialStatementDetails
  }

  type FinancialStatementDetails {
    statementYear: String,
    statementFromDate: String,
    statementToDate: String,
    statementId: String,
    companyName: String,
    companyLocation: String,
    businessSectorCode: String,
    companyId: String,
    changeType: String,
    consolidatedStatement: String,
    statementAuthorName: String,
    statementAuthorUnid: String,
    statementAuthorEmail: String,
    companyOfficialFirstName: String,
    companyOfficialLastName: String,
    companyOfficialUnid: String,
    statementCashFlowMethod: String,
    statementDate: String,
    balanceStatsSheet: BalanceStatsSheet
  }

  type BalanceStatsSheet {
    "Prosjecan broj zaposlenih"
    field001: String,

    "Prihodi od prodaje robe"
    field002: String,

    "Prihodi od prodaje proizvoda i usluga"
    field003: String,

    "Prihodi od aktiviranja ucinaka i robe"
    field004: String,

    "Prihodi od subvencija, prihodi od dotacija i prihodi od donacija"
    field005: String,

    "Prihodi od zakupnina"
    field006: String,

    "Dobici od prodaje materijala"
    field007: String,

    "Nabavna vrijednost prodate robe"
    field008: String,

    "Troškovi materijala za izradu"
    field009: String,

    "Troškovi ostalog materijala (režijskog)"
    field010: String,

    "Troškovi goriva i energije"
    field011: String,

    "Troškovi zarada i naknada zarada (bruto)"
    field012: String,

    "Naknada troškova smještaja i ishrane na službenom putu, naknade troškova prevoza na službenom putu"
    field013: String,

    "Troškovi proizvodnih usluga"
    field014: String,

    "Troškovi transportnih usluga i troškovi usluga održavanja"
    field015: String,

    "Troškovi zakupnina"
    field016: String,

    "Troškovi sajmova i troškovi reklame i propagande"
    field017: String,

    "Troškovi istraživanja"
    field018: String,

    "Troškovi neproizvodnih usluga i troškovi reprezentacije"
    field019: String,

    "Troškovi premija osiguranja i troškovi platnog prometa"
    field020: String,

    "Gubici od prodaje materijala"
    field021: String,

    "Zalihe materijala"
    field022: String,

    "Zalihe nedovršene proizvodnje"
    field023: String,

    "Zalihe gotovih proizvoda"
    field024: String,

    "Zalihe roba"
    field025: String,

    "Prihodi od naknade po osnovu patenata"
    field026: String,

    "Prihodo po osnovu autorskih prava"
    field027: String,

    "Prihodi od prodaje licenci"
    field028: String,

    "Ulaganja u razvoj"
    field029: String,

    "Ulaganja u razvoj tržišta, sa efektom dužim od jedne godine"
    field030: String,

    "Ulaganja u razvoj tehnologije, sa efektom dužim od jedne godine"
    field031: String,

    "Ulaganja u razvoj proizvoda, sa efektom dužim od jedne godine"
    field032: String,

    "Ostali izdaci za razvoj"
    field033: String,

    "Ispravka vrijednosti ulaganja u razvoj"
    field034: String,

    "Obezvredjivanje vrijednosti ulaganja u razvoj"
    field035: String,

    "Koncesije, patenti, licence i slicna prava"
    field036: String,

    "Koncesije"
    field037: String,

    "Patenti"
    field038: String,

    "Licence"
    field039: String,

    "Pravo na industrijski uzorak, žig, model, zaštitni znak i sl."
    field040: String,

    "Druga slicna prava"
    field041: String,

    "Ispravka vrijednosti koncesija, patenata, licenci i slicnih prava"
    field042: String,

    "Obezvredjivanje koncesija, patenata, licenci i slicnih prava"
    field043: String,

    "Goodwill"
    field044: String,

    "Goodwill nastao po osnovu stecene (pripojene) neto imovine drugog pravnog lica"
    field045: String,

    "Goodwill nastao po osnovu kupovine akcija i udjela u drugom pravnom licu"
    field046: String,

    "Obezvredjivanje goodwill-a"
    field047: String,

    "Ostala nematerijalna ulaganja"
    field048: String,

    "Racunarski programi"
    field049: String,

    "Pravo korišcenja gradskog gradjevinskog zemljišta"
    field050: String,

    "Ulaganja u lizing"
    field051: String,

    "Ostala nematerijalna ulaganja"
    field052: String,

    "Ispravka vrijednosti ostalih nematerijalnih ulaganja"
    field053: String,

    "Obezvredjivanje ostalih nematerijalnih ulaganja"
    field054: String,

    "Nematerijalna ulaganja u pripremi"
    field055: String,

    "Ulaganja u razvoj u pripremi"
    field056: String,

    "Interno generisana nematerijalna ulaganja u pripremi"
    field057: String,

    "Druga nematerijalna ulaganja u pripremi"
    field058: String,

    "Obezvredjivanje nematerijalnih ulaganja u pripremi"
    field059: String,

    "Avansi za nematerijalna ulaganja"
    field060: String,

    "Avansi za nematerijalna ulaganja u razvoj"
    field061: String,

    "Avansi za druga nematerijalna ulaganja"
    field062: String
  }

  "Poreska uprava"
  type Taxis {
    institution: String,
    version: String,
    company(companyId: String!): TaxisCompany
  }

  type Query {
    hello: String,
    crps: Crps,
    taxis: Taxis
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world',
    crps: () => {
      return {
        institution: "Centralni Registar Privrednih Subjekata",
        version: "1"
      }
    },
    taxis: () => {
      return {
        institution: "Poreska Uprava",
        version: "1"
      }
    }
  },

  Crps: {
    company: (_, { companyId }, __) => {
      return getCrpsCompany({ companyId });
    }
  },

  Taxis: {
    company: (_, { companyId }, __) => {
      return getTaxisCompany({ companyId });
    }
  },

  TaxisCompany: {
    financialStatements: (company, _, __) => {
      return getTaxisCompanyStatements({ companyId: company.companyId });
    }
  },

  FinancialStatement: {
    details: (statement, _, __) => {
      return getTaxisCompanyStatement({ statementId: statement.statementId });
    }
  },

  FinancialStatementDetails: {
    balanceStatsSheet: (statementDetails, _, __) => {
      return statementDetails.balanceStatsSheet;
    }
  }

};

const app = express();

const server = new ApolloServer({ typeDefs, resolvers, path: '/graphql' });

server.applyMiddleware({ app });

app.get('/playground', playground({ endpoint: '/dev/graphql' }));

const handler = serverless(app);

export { handler };
