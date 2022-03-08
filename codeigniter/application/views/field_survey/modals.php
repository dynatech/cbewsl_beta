<div class="modal fade" id="field_survey_modal" tabindex="-1" role="dialog" aria-labelledby="fieldSurveyModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="fieldSurveyModal">EDIT: Field Survey</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
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
                        <button class="btn btn-primary btn-sm" style="display: none;" type="button" id="add_field_survey_spinner" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Saving. . .
                        </button>
                        <button type="button" class="btn btn-primary btn-sm" id="add_field_survey">Add</button>
                        <button type="button" class="btn btn-danger btn-sm" id="cancel_add_field_survey">Cancel</button>
                    </div>
                    <br>
                    <br>
                </form>
            </div>
        </div>
        <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
    </div>
</div>

<div class="modal fade" id="sendEmailFieldSurveyModal" tabindex="-1" role="dialog" aria-labelledby="sendEmailFieldSurveyModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="sendEmailFieldSurveyModalLabel">Send field survey via email</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="email_for_field_survey">Send this to:</label>
                            <input type="text" class="form-control" id="email_for_field_survey" placeholder="example@email.com">
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button class="btn btn-primary" type="button" id="send_field_survey_spinner" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Sending. . .
            </button>
            <button type="button" class="btn btn-primary" id="confirm_send_field_survey">Confirm</button>
        </div>
        </div>
    </div>
</div>