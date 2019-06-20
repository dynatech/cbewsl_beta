<nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="latest_report_summary_tab" data-toggle="tab" href="#latest_report_summary" role="tab" aria-controls="latest_report_summary" aria-selected="true">Latest Report Summary</a>
        <a class="nav-item nav-link" id="field_survey_logs_tab" data-toggle="tab" href="#field_survey_logs" role="tab" aria-controls="field_survey_logs" aria-selected="false">Field Survey Logs</a>
    </div>
</nav>
<div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="latest_report_summary" role="tabpanel" aria-labelledby="latest_report_summary_tab">
        <div class="card">
            <div class="card-body">
            
                <div class="row">
                    <div class="col-6">
                        <table class="table table-borderless">
                            <tbody>
                                <tr>
                                    <td colspan="3" id="latest_date_of_survey">Date: 00-00-00</td>
                                </tr>
                                <tr>
                                    <td>Features</td>
                                    <td id="latest_features">[data here]</td>
                                </tr>
                                <tr>
                                    <td>Materials characterization</td>
                                    <td id="latest_mat_characterization">[data here]</td>
                                </tr>
                                <tr>
                                    <td>Mechanism</td>
                                    <td id="latest_mechanism">[data here]</td>
                                </tr>
                                <tr>
                                    <td>Exposure</td>
                                    <td id="latest_exposure">[data here]</td>
                                </tr>
                                <tr>
                                    <td>Note</td>
                                    <td id="latest_note">[data here]</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col">
                        
                    </div>
                </div>
        
            
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="field_survey_logs" role="tabpanel" aria-labelledby="field_survey_logs_tab">
        <div class="card">
            <div class="card-body">
                <div class="container">
                    <div id="field_survey_form_container" style="display:none;">
                        <form>
                            <input type="hidden" class="form-control" id="field_survey_id" value="0">
                            <div class="row">
                                <div class="col">
                                    <div class="form-group">
                                        <label for="number_of_members">Features</label>
                                        <textarea class="form-control" id="features" style="height : 200px"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="form-group">
                                        <label for="number_of_members">Material Characterization</label>
                                        <input type="text" class="form-control" id="mat_characterization">
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="form-group">
                                        <label for="number_of_vulnerable">Mechanism</label>
                                        <input type="text" class="form-control" id="mechanism">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div class="form-group">
                                        <label for="number_of_members">Exposure</label>
                                        <input type="text" class="form-control" id="exposure">
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="form-group">
                                        <label for="number_of_vulnerable">Note</label>
                                        <input type="text" class="form-control" id="note">
                                    </div>
                                </div>
                            </div>
                            <div class="float-right">
                                <button type="button" class="btn btn-primary btn-sm" id="add_field_survey">Add</button>
                                <button type="button" class="btn btn-danger btn-sm" id="cancel_add_field_survey">Cancel</button>
                            </div>
                            <br>
                            <br>
                        </form>
                    </div>
                    <table id="field_survey_logs_table" class="display table table-striped" style="width:100%">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Offcial Report</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>Date</th>
                                <th>Offcial Report</th>
                                <th>Actions</th>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-light btn-block" id="add_field_survey_form"><i class="fas fa-plus-circle text-center"></i> Add Row</button>
                        </div>
                        <div class="col">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>