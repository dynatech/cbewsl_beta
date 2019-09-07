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
                <p id="field_survey_status"></p>
                <div class="row" id="latest_report_summary_details">
                    <div>
                        <img src="http://cbewsl.com/assets/images/letter_header1.png" style="width: 100%"></img>
                        <img src="http://cbewsl.com/assets/images/banner_new.png" style="width: 100%"></img>
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
                        <img src="http://cbewsl.com/assets/images/letter_footer1.png" style="width: 100%"></img>
                    </div>
                    <div class="float-left" style="padding-top: 100px;">
                        <button type="button" class="btn btn-primary btn-sm" id="send_latest_field_survey">SEND</button>
                        <button type="button" class="btn btn-primary btn-sm" id="print_latest_field_survey">SAVE & PRINT</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="editor"></div>
    <div class="tab-pane fade" id="field_survey_logs" role="tabpanel" aria-labelledby="field_survey_logs_tab">
        <div class="card">
            <div class="card-body">
                <div class="container">
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