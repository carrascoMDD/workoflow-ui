# workOflow :  workoflow-ui outer install
**workOflow Installer for a Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.**

Local installs of cordova and ionic to avoid breaking this or other ionic apps upon any update of global install (it's known to happen).

In support and containing a Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.
The real app is inside a nested directory 
**flowable-ionic4angular6-inbox01app**.
https://github.com/carrascoMDD/workoflow-ui/tree/master/flowable-ionic4angular6-inbox01app

This "outer" npm package has been used to obtain a local install of cordova and ionic, and using these then
create a flowable-ionic4angular6-inbox01app with an ionic starter.

It's clearly a bit embarrassing, but it is even more embarrassing to have this crash any future day
because cordova or ionic was installed globally and then updated.

This way the project (and github repository) holds both the project to create the project, and the real app.

Creation of the inner app was performed by running in bash shell:

~~~~
# convenience shell function to run from npm node_modules bin
function npm-do { (PATH=$(npm bin):$PATH; eval $@;) }

npm-do ionic start flowable-ionic4angular6-inbox01app super
~~~~

Then to run the application:

~~~~
cd flowable-ionic4angular6-inbox01app
 ../node_modules/.bin/ionic serve
~~~~
 

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
