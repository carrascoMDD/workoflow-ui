# workoflow-ui outer package for ionic and cordova install and inner package with app 
**ionic & cordova install for Single-Page-Application and hybrid Android/iOS app with Ionic3/Angular6 over Flowable REST API/Spring Boot/Java**

Local installs of cordova and ionic to avoid breaking this or other ionic apps upon any update of global install (it's known to happen).

In support and containing a Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.
The real app is inside a nested directory 
**workoflow-uiapp**.
https://github.com/carrascoMDD/workoflow-ui/tree/master/workoflow-uiapp

This "outer" npm package has been used to obtain a local install of cordova and ionic, and using these then
create a workoflow-uiapp with an ionic starter.

It's clearly a bit embarrassing, but it is even more embarrassing to have this crash any future day
because cordova or ionic was installed globally and then updated.

This way the project (and github repository) holds both the project to create the project, and the real app.

To install for first time, clone or download & unzip this repository from 
https://github.com/carrascoMDD/workoflow-ui

~~~~
cd workflow-ui
npm install
# shall install ionic3 and cordova8 which are the "outer" package dependencies

cd workflow-uiapp
npm install
# shall install the UI application dependencies

# then to run
../node_modules/.bin/ionic serve
# or alternatively with the supplied convenience bash shell script
./run.sh
~~~~

Shall launch an ionic dev server running on http://localhost:8100/ and open a browser (tab) on that URL



http://workOflow.org

Created @author Antonio Carrasco Valero 201805252222

Copyright 2018 Antonio Carrasco Valero

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
