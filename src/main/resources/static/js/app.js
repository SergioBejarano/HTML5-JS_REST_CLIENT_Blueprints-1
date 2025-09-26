var app = (function() {
    
    var selectedAuthor = "";
    var blueprintsList = [];
    
    return {
        
        setAuthor: function(authorName) {
            if (authorName && authorName.trim() !== "") {
                selectedAuthor = authorName.trim();
            } else {
                selectedAuthor = "";
                blueprintsList = [];
            }
        },
        
        updateBlueprintsList: function(authorName) {
            selectedAuthor = authorName;
            
            // Invocar getBlueprintsByAuthor del módulo apimock
            apimock.getBlueprintsByAuthor(authorName, function(blueprints) {
                
                // Limpiar la tabla existente
                $("#blueprintsTable tbody").empty();
                $("#authorName").text("");
                $("#totalPoints").text("0");
                
                if (blueprints) {
                    // Actualizar el nombre del autor en la UI
                    $("#authorName").text(selectedAuthor + "'s blueprints:");
                    
                    // Primer map: convertir elementos a objetos con solo nombre y número de puntos
                    blueprintsList = blueprints.map(function(blueprint) {
                        return {
                            name: blueprint.name,
                            numberOfPoints: blueprint.points.length
                        };
                    });
                    
                    // Segundo map: agregar elementos <tr> a la tabla usando jQuery
                    blueprintsList.map(function(blueprint) {
                        var row = $("<tr>");
                        row.append($("<td>").text(blueprint.name));
                        row.append($("<td>").text(blueprint.numberOfPoints));
                        $("#blueprintsTable tbody").append(row);
                        return row;
                    });
                    
                    // Reduce: calcular el número total de puntos
                    var totalPoints = blueprintsList.reduce(function(total, blueprint) {
                        return total + blueprint.numberOfPoints;
                    }, 0);
                    
                    // Actualizar el campo de total de puntos en el DOM usando jQuery
                    $("#totalPoints").text(totalPoints);
                    
                } else {
                    blueprintsList = [];
                    $("#authorName").text("No blueprints found for author: " + authorName);
                }
            });
        },
        
        getCurrentAuthor: function() {
            return selectedAuthor;
        },
        
        getCurrentBlueprints: function() {
            return blueprintsList.slice(); 
        },
        
        openBlueprint: function(blueprintName) {
            if (selectedAuthor && blueprintName) {
                apimock.getBlueprintsByNameAndAuthor(selectedAuthor, blueprintName, function(blueprint) {
                    if (blueprint) {
                        alert("Opening blueprint: " + blueprintName + " by " + selectedAuthor + 
                              "\nPoints: " + JSON.stringify(blueprint.points, null, 2));
                    } else {
                        alert("Blueprint not found!");
                    }
                });
            }
        },
        
        init: function() {
            // Asociar la operación updateBlueprintsList al evento click del botón
            $("#getBlueprintsBtn").click(function() {
                var authorName = $("#authorInput").val();
                if (authorName && authorName.trim() !== "") {
                    app.updateBlueprintsList(authorName.trim());
                }
            });
            
            // También permitir búsqueda con Enter
            $("#authorInput").keypress(function(e) {
                if (e.which === 13) { // Enter key
                    var authorName = $("#authorInput").val();
                    if (authorName && authorName.trim() !== "") {
                        app.updateBlueprintsList(authorName.trim());
                    }
                }
            });
        }
    };
    
})();

$(document).ready(function() {
    app.init();
});
