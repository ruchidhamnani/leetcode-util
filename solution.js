/* Step 1: Adding Submission column header to the table -
 *         a. Find the table header element.
 *         b. Create the Submission header <th> element.
 *         c. Add this element to the header.
 *              - Add the element only when this column doesn't exist (Optional)
 */
function addSubmissionColumnHeader() {
  let element = document.querySelector(
    "#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > thead > tr"
  );

  let thElement = document.createElement("th");

  thElement.setAttribute(
    "class",
    "reactable-th-status reactable-header-sortable "
  );
  thElement.setAttribute("role", "button");
  thElement.setAttribute("tabindex", "0");

  let str = document.createElement("strong");
  str.innerText = "Submissions";

  thElement.appendChild(str);
  element.appendChild(thElement);
}

/* Step 2: Find the API endpoint for retrieving all problems
 */
function getApiUrl() {
  return "https://leetcode.com/api/problems/all/";
}

/* Step 3: Get all the problems as an Array in the following object format by using fetch -
 *          {
 *              id: "",
 *              total_submitted: "",
 *              total_acs: ""
 *          }
 */

async function getAllProblems(apiUrl) {
  let arr =[];
  await fetch(apiUrl)
                    .then((res) => res.json())
                    
                    .then((data)=>{
                      arr = data.stat_status_pairs.map((element) => ({
                        id: element.stat.frontend_question_id,
                        total_submitted: element.stat.total_submitted,
                        total_acs: element.stat.total_acs,
                      }));
                    })
  

  return arr;
}

/* Step 4: Getting every problem's row in the form of an array
 */
function getAllProblemRowElements() {


return Array.from(document.querySelectorAll('#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > tbody.reactable-data > tr'));
}






/* Step 5: Adding total_acs / total_submitted to each row element of the table on the page. Iterate through each row element and add a new <td> containing the submission data in the provided format
 */
function addSubmissionsToEachProblem(allProblemRowElements, allProblems) {
 
  for(let i=0;i<allProblemRowElements.length;i++){
    let problemRowSingle = allProblemRowElements[i];
    let problemId = parseInt(problemRowSingle.getElementsByTagName('td')[1].innerHTML)
let requiredObject = allProblems.find(findId);
function findId(obj){
    if(obj.id === problemId)
    return true;
}

let submissions = requiredObject.total_acs.toString()+ "/" +requiredObject.total_submitted.toString();
var x = document.createElement('td');
x.innerText = submissions;

problemRowSingle.appendChild(x);

  }


}

/* Step 6: Putting it all together

Get all problems on Leetcode using getAllProblems() which in turn makes call to getApiUrl()

Add a header column titled "Submissions" by using addSubmissionColumnHeader()

To add the Submissions data to each row, fetch references to all the rows by using getAllProblemRowElements()

Add submissions data to each row by using addSubmissionsToEachProblem()


Convert all the steps above into function calls while making temporary variables in Steps a) and c), and pass them as parameters in Step d).
 */
async function createSubmissionColumnForLeetCode() {
  let apiUrl = getApiUrl();
  let tempallProblems = await getAllProblems(apiUrl);
  addSubmissionColumnHeader();
  let tempProblemRowElements = await getAllProblemRowElements();
  addSubmissionsToEachProblem(tempProblemRowElements,tempallProblems);


}

/* Step 7: Additional code for making script tampermonkey ready. This is done so that the script is properly executed when we visit https://leetcode.com/problemset/all/
 */
let tableCheck = setInterval(() => {
  if(!((document.querySelector('#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table')).length))
  {
    createSubmissionColumnForLeetCode();
    clearInterval(tableCheck);
 
  }
 }, 100);

// getAllProblems("https://leetcode.com/api/problems/all/");


module.exports = {
  getApiUrl,
  getAllProblems,
  addSubmissionColumnHeader,
  getAllProblemRowElements,
  addSubmissionsToEachProblem,
  createSubmissionColumnForLeetCode,
};
