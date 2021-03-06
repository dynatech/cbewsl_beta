<!-- Risk Profile Modal -->
<div class="modal fade" id="riskProfileModal" tabindex="-1" role="dialog" aria-labelledby="riskProfileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="riskProfileModalLabel">EDIT: Risk Profile</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <div class="form-group">
                    <label for="entry">Entry</label>
                    <textarea class="form-control" id="entry" style="height : 200px"></textarea>
                    <input type="hidden" class="form-control" id="risk_profile_id" value="0">
                </div>
                <button class="btn btn-primary btn-sm float-right" style="display: none;" type="button" id="add_risk_profile_spinner" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Saving. . .
                </button>
                <button type="button" class="btn btn-primary btn-sm float-right" id="add_risk_profile">Add</button>
                <br>
                <br>
            </form>

            <table id="risk_profile_table" class="display table table-striped" style="width:100%">
                <thead>
                    <tr>
                        <th>Date and Time</th>
                        <th>Entry</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Date and Time</th>
                        <th>Entry</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
    </div>
</div>


<!-- Hazard Map Modal -->
<div class="modal fade" id="hazardMapModal" tabindex="-1" role="dialog" aria-labelledby="hazardMapModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="hazardMapModalLabel">EDIT: Hazard Map</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form method="post" id="upload_form" enctype="multipart/form-data">
                <div class="row">
                    <div class="col">
                        <input type="file" id="image_file" multiple="multiple" />
                        <button type="button" class="btn btn-primary" id="save_hazard_map">Add</button>
                        <button class="btn btn-primary" type="button" id="upload_hazard_map_spinner" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Uploading
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <b id="upload_status"></b>
                        <div id="uploadPreview"></div>
                    </div>
                </div>
            </form>
            <br>
            <table id="hazard_map_table" class="display table table-striped" style="width:100%">
                <thead>
                    <tr>
                        <th>Date and Time</th>
                        <th>File Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Date and Time</th>
                        <th>File Name</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
    </div>
</div>

<!-- Hazard Data Modal -->
<div class="modal fade" id="hazardDataModal" tabindex="-1" role="dialog" aria-labelledby="hazardDataModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="hazardDataModalLabel">EDIT: Hazard Data</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" class="form-control" id="hazard_data_id" value="0">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="hazard">Hazard</label>
                            <input type="text" class="form-control" id="hazard" placeholder="E.g. Typhoon">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="speed_of_onset">Speed of Onset</label>
                            <input type="text" class="form-control" id="speed_of_onset" placeholder="E.g. Slow">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="early_warning">Early Warning</label>
                            <input type="text" class="form-control" id="early_warning" placeholder="E.g. EWS-L">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="impact">Impact</label>
                            <input type="text" class="form-control" id="impact" placeholder="E.g. Impact">
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm float-right" style="display: none;" type="button" id="add_hazard_data_spinner" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Saving. . .
                </button>
                <button type="button" class="btn btn-primary btn-sm float-right" id="add_hazard_data">Add</button>
                <br>
                <br>
            </form>
            
            <table id="hazard_data_table" class="display table table-striped" style="width:100%">
                <thead>
                    <tr>
                        <th>Hazard</th>
                        <th>Speed of Onset</th>
                        <th>Early Warning</th>
                        <th>Impact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Hazard</th>
                        <th>Speed of Onset</th>
                        <th>Early Warning</th>
                        <th>Impact</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
    </div>
</div>

<!-- Resources and Capacities Modal -->
<div class="modal fade" id="resourcesAndCapacitiesModal" tabindex="-1" role="dialog" aria-labelledby="resourcesAndCapacitiesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="resourcesAndCapacitiesModalLabel">EDIT: Resources and Capacities</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" class="form-control" id="resources_and_capacities_id" value="0">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="resources_capacity">Resource/Capacity</label>
                            <input type="text" class="form-control" id="resources_capacity" placeholder="E.g. Evacuation Center">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="status">Status</label>
                            <input type="text" class="form-control" id="status" placeholder="E.g. Status">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="owner">Owner</label>
                            <input type="text" class="form-control" id="owner" placeholder="E.g. Owner">
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm float-right" style="display: none;" type="button" id="add_resources_capacity_spinner" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Saving. . .
                </button>
                <button type="button" class="btn btn-primary btn-sm float-right" id="add_resources_capacity">Add</button>
                <br>
                <br>
            </form>

            <table id="resources_and_capacities_table" class="display table table-striped" style="width:100%">
                <thead>
                    <tr>
                        <th>Resource/Capacity</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Resource/Capacity</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
    </div>
</div>

<!-- Family Risk Profile Modal -->
<div class="modal fade" id="familyRiskProfileModal" tabindex="-1" role="dialog" aria-labelledby="familyRiskProfileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="familyRiskProfileModalLabel">EDIT: Family Risk Profile</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" class="form-control" id="family_profile_id" value="0">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="number_of_members">Number of Members                         </label>
                            <input type="number" class="form-control" id="number_of_members" placeholder="E.g. 1">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="number_of_vulnerable">Number of vulnerable</label>
                            <input type="number" class="form-control" id="number_of_vulnerable" placeholder="E.g. 1">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="nature_of_vulnerability">Nature of Vulnerability                       </label>
                            <input type="text" class="form-control" id="nature_of_vulnerability" placeholder="E.g. PWD, Children">
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm float-right" style="display: none;" type="button" id="add_family_risk_spinner" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Saving. . .
                </button>
                <button type="button" class="btn btn-primary btn-sm float-right" id="add_family_risk">Add</button>
                <br>
                <br>
                <div class="container" id="family_risk_field_alert" style="display: none;">
                    <div class="row">
                        <div class="col-sm">
                        </div>
                        <div class="col-sm">
                            <div class="alert alert-primary text-center" role="alert">
                                All <b>fields</b> are required.
                            </div>
                        </div>
                        <div class="col-sm">
                        </div>
                    </div>
                </div>
            </form>

            <table id="family_risk_profile_table" class="display table table-striped" style="width:100%">
                <thead>
                    <tr>
                        <th>Household No.</th>
                        <th>Number of members</th>
                        <th>Number of members belonging to vulnerable groups</th>
                        <th>Nature of Vulnerability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Household No.</th>
                        <th>Number of members</th>
                        <th>Number of members belonging to vulnerable groups</th>
                        <th>Nature of Vulnerability</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
    </div>
</div>
