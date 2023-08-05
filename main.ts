import organisationData from './Employee_data/organization_data.json'
interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
    };
    const ceo: Employee = organisationData;
     interface IEmployeeOrgApp {
        // ceo: Employee;
        /**
        * Moves the employee with employeeID (uniqueId) under a supervisor
        * (another employee) that has supervisorID (uniqueId).
        * E.g. Move Bob(employeeID) to be subordinate of
        * Georgina (supervisorID).
        * @param employeeID
        * @param supervisorID
        */
        move(employeeID: number, supervisorID: number): void;
        /** Undo last move action */
        undo(): void;
        /** Redo last undone action */
        redo(): void;
        }

        class EmployeeOrgApp implements IEmployeeOrgApp {
            private organization: Employee;
            private moveHistory: { employeeID: number; previousSupervisorID: number ,
                newSupervisorID: number ,previousEmployeeSubordinates:Employee[] ,previousSupervisorSubordinates:Employee[] }[];
            private undoneMoves: { employeeID: number; previousSupervisorID: number ,
                newSupervisorID: number ,previousEmployeeSubordinates:Employee[],previousSupervisorSubordinates:Employee[] }[];          
            constructor(ceo: Employee) {
              this.organization = ceo;
              this.moveHistory = [];
              this.undoneMoves = [];
            }

            move(employeeID: number, supervisorID: number): void {
                const employee = this.findEmployeeById(this.organization, employeeID);
                const currentSupervisor = this.findSupervisor(this.organization, employeeID);
                const newSupervisor = this.findEmployeeById(this.organization, supervisorID);

                if (!employee || !currentSupervisor) {
                  console.log("Employee not found. (Move Abondoned)");
                  return;
                }
                if (!newSupervisor) {
                    console.log("New supervisor not found. (Move Abondoned)");
                    return;
                  }
                // Move the employee by updating the supervisors
                currentSupervisor.subordinates = currentSupervisor.subordinates.filter(
                  (subordinate) => subordinate.uniqueId !== employeeID
                );
                 // Store the move action in history
                const flag_employeeSubordinates =employee.subordinates;
                const flag_currentSupervisor_Subordinates =currentSupervisor.subordinates;

                if(employee.subordinates.length>0)
                {
                    currentSupervisor.subordinates =[...currentSupervisor.subordinates , ...employee.subordinates]
                    employee.subordinates=[];
                }
               newSupervisor.subordinates.push(employee);
            
               this.moveHistory.push({
                employeeID: employeeID,
                previousSupervisorID: currentSupervisor.uniqueId,
                previousSupervisorSubordinates: flag_currentSupervisor_Subordinates,
                previousEmployeeSubordinates :flag_employeeSubordinates,
                newSupervisorID:newSupervisor.uniqueId
              });
               
              // Clear undoneMoves when new moves are made
              this.undoneMoves = [];
              }
            
            undo(): void {
                if (this.moveHistory.length === 0) {
                  console.log("No moves to undo.");
                  return;
                }
            
                const lastMove = this.moveHistory.pop();
            
                if (!lastMove) {
                  console.log("Error during undo.");
                  return;
                }
            
                const employee = this.findEmployeeById(this.organization, lastMove.employeeID);
                const currentSupervisor = this.findSupervisor(this.organization, lastMove.employeeID);
                const previousSupervisor = this.findEmployeeById(
                  this.organization,
                  lastMove.previousSupervisorID
                );
            
                if (!employee || !currentSupervisor || !previousSupervisor) {
                  console.log("Error during undo.");
                  return;
                }
            
                // Move the employee back to the previous supervisor
                currentSupervisor.subordinates = currentSupervisor.subordinates.filter(
                  (subordinate) => subordinate.uniqueId !== employee.uniqueId
                );
                employee.subordinates=lastMove.previousEmployeeSubordinates;
                previousSupervisor.subordinates =lastMove.previousSupervisorSubordinates
                previousSupervisor.subordinates.push(employee);
            
                // Store the undone move in undoneMoves
                this.undoneMoves.push(lastMove);
              }
            
            
              redo(): void {
                if (this.undoneMoves.length === 0) {
                  console.log("No moves to redo.");
                  return;
                }
            
                const lastUndoneMove = this.undoneMoves.pop();
            
                if (!lastUndoneMove) {
                  console.log("Error during redo.");
                  return;
                }
                //Doing the move operation again for better code reusability
            this.move(lastUndoneMove.employeeID,lastUndoneMove.newSupervisorID);
        
              }
            
            private findEmployeeById(root: Employee, id: number): Employee | null {
                if (root.uniqueId === id) {
                  return root;
                }
            
                for (const subordinate of root.subordinates) {
                  const foundEmployee = this.findEmployeeById(subordinate, id);
                  if (foundEmployee) {
                    return foundEmployee;
                  }
                }
            
                return null;
              }
            
              private findSupervisor(root: Employee, id: number): Employee | null {
                if (!root.subordinates) {
                  return null;
                }
            
                for (const subordinate of root.subordinates) {
                  if (subordinate.uniqueId === id) {
                    return root;
                  }
            
                  const foundSupervisor = this.findSupervisor(subordinate, id);
                  if (foundSupervisor) {
                    return foundSupervisor;
                  }
                }
            
                return null;
              }
            
        }

        const app = new EmployeeOrgApp(ceo) 
        console.log("After Move")
        app.move(11,5);
        console.log(JSON.stringify(ceo));
        console.log('After undo')
        app.undo();
        console.log(JSON.stringify(ceo));
        console.log('After redo')
        app.redo();
        console.log(JSON.stringify(ceo));

        
