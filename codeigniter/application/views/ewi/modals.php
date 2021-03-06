<div class="modal fade" id="validate_alert_modal" tabindex="-1" role="dialog" aria-labelledby="validateAlertModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="validateAlertModalLabel">Alert Validation</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <label for="alert_remarks">Remarks</label>
            <textarea class="form-control" id="alert_remarks" style="height : 100px"></textarea>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="save_alert_validation">Save</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
</div>

<div class="modal fade" id="confirm_valid_alert_modal" tabindex="-1" role="dialog" aria-labelledby="confirmValidAlertModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="confirmValidAlertModalLabel">Release Alert</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body text-center" id="valid_alert_information">
            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="confirm_release_alert">Confirm</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
        </div>
    </div>
</div>

<div class="modal fade" id="sendEwiToEmailModal" tabindex="-1" role="dialog" aria-labelledby="sendEwiToEmailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="sendEwiToEmailModalLabel">Send EWI via email</h5>
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
                            <input type="text" class="form-control" id="email_for_ewi" placeholder="example@email.com">
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" type="button" style="display:none" id="confirm_send_ewi_spinner" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Sending. . .
            </button>
            <button type="button" class="btn btn-secondary" id="close_send_ewi" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="confirm_send_ewi">Confirm</button>
        </div>
        </div>
    </div>
</div>

<div class="modal fade" id="confirmReleaseModal" tabindex="-1" role="dialog" aria-labelledby="confirmReleaseModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="confirmReleaseModalLabel">Confirmation</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
        Are you sure you want release this alert?
            <!-- <form>
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="email_for_field_survey">Send this to:</label>
                            <input type="text" class="form-control" id="email_for_ewi" placeholder="example@email.com">
                        </div>
                    </div>
                </div>
            </form> -->
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" type="button" style="display:none" id="confirm_release_ewi_modal_spinner" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Releasing. . .
            </button>
            <button type="button" class="btn btn-secondary" id="close_release_ewi_modal" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="confirm_release_ewi_modal">Confirm</button>
        </div>
        </div>
    </div>
</div>