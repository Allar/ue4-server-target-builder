# ue4-server-target-builder

This is an overengineered Node app that lets me generate a server target so that I can use it in automated systems such as Jenkins to build server builds of Blueprint only projects without requiring C++.

# Installation 

`npm install Allar/ue4-server-target-builder -g`

# Usage

`ue4-server-target-builder -p GenericShooter -d c:/depot/GenericShooter`

Supply `-c` argument in order to return with error code 1 if project is detected as blueprint only project. Useful if you need to know this in your automation chain.