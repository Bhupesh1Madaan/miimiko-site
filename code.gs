/**
 * Google Apps Script Web App for Miimiko Minds Website API
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click Extensions -> Apps Script.
 * 3. Replace all code in the editor with this script.
 * 4. Create a sheet tab named "Courses" with the following columns:
 *    id | name | icon | tagline | brief | description | image | displayDuration | totalSessions | sessionDuration | minAge | maxAge | mode | schedule | frequency | materials | certificate | teachers | language | whatYoullLearn
 * 
 * 5. Create a separate sheet tab for each course ID (e.g. "drawing", "painting", "calligraphy", "phonics").
 *    - In each course curriculum sheet:
 *      - Row 1 should contain Level names as columns (e.g. Column A: "Level 1", Column B: "Level 2", Column C: "Level 3").
 *      - Rows 2 and below should contain the names of the sessions for that level.
 * 
 * 6. Click Deploy -> New deployment.
 *    - Select type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click Deploy, authorize permissions, and copy the Web App URL.
 * 8. Update VITE_API_BASE_URL in your .env file with this URL.
 */

function doGet(e) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Read the Courses sheet
    var coursesSheet = spreadsheet.getSheetByName("Courses");
    if (!coursesSheet) {
      return createJsonResponse({ error: "Courses sheet not found. Please create a sheet named 'Courses'." }, 404);
    }
    
    var coursesData = coursesSheet.getDataRange().getValues();
    if (coursesData.length <= 1) {
      return createJsonResponse([], 200);
    }
    
    var headers = coursesData[0].map(function(h) { return h.toString().trim(); });
    var courses = [];
    
    for (var i = 1; i < coursesData.length; i++) {
      var row = coursesData[i];
      var course = {};
      var hasData = false;
      
      for (var j = 0; j < headers.length; j++) {
        var header = headers[j];
        if (!header) continue;
        
        var value = row[j];
        if (value !== undefined && value !== null && value.toString().trim() !== "") {
          hasData = true;
        }
        
        // Custom formatting/parsing based on column headers
        if (header === "whatYoullLearn") {
          if (value) {
            // Split by newline or comma to create array
            course[header] = value.toString()
              .split(/\r?\n|,/)
              .map(function(s) { return s.trim(); })
              .filter(Boolean);
          } else {
            course[header] = [];
          }
        } else if (header === "totalSessions" || header === "minAge" || header === "maxAge") {
          course[header] = value ? Number(value) : 0;
        } else {
          course[header] = value !== undefined && value !== null ? value.toString().trim() : "";
        }
      }
      
      // Skip empty rows
      if (!hasData || !course.id) continue;
      
      // 2. Fetch curriculum from sheet named after the course ID (e.g. "drawing", "painting", "calligraphy", "phonics")
      var courseId = course.id.toString().toLowerCase();
      var sheets = spreadsheet.getSheets();
      var curriculumSheet = null;
      for (var s = 0; s < sheets.length; s++) {
        var sName = sheets[s].getName().trim().toLowerCase();
        if (sName === courseId) {
          curriculumSheet = sheets[s];
          break;
        }
      }
      var curriculum = [];
      
      if (curriculumSheet) {
        var currData = curriculumSheet.getDataRange().getValues();
        if (currData.length > 0) {
          var levelHeaders = currData[0]; // e.g. ["Level 1", "Level 2", "Level 3"]
          
          for (var col = 0; col < levelHeaders.length; col++) {
            var levelName = levelHeaders[col].toString().trim();
            if (levelName === "") continue;
            
            var sessions = [];
            for (var r = 1; r < currData.length; r++) {
              if (col < currData[r].length) {
                var sessionVal = currData[r][col];
                if (sessionVal !== undefined && sessionVal !== null) {
                  var cleanedVal = sessionVal.toString().trim()
                    .replace(/^[▶➤►➔➜➜•●■\-*\s]+/, '') // Strip arrow/bullet/triangle prefixes
                    .trim();
                  if (cleanedVal !== "") {
                    sessions.push(cleanedVal);
                  }
                }
              }
            }
            
            curriculum.push({
              level: levelName,
              sessions: sessions
            });
          }
        }
      }
      
      course.curriculum = curriculum;
      courses.push(course);
    }
    
    return createJsonResponse(courses, 200);
    
  } catch (error) {
    return createJsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Helper to build CORS-enabled JSON responses
 */
function createJsonResponse(data, statusCode) {
  var output = JSON.stringify(data);
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
