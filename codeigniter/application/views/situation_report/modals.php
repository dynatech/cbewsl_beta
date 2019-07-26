<div class="modal fade" id="sendEmailSituationReportModal" tabindex="-1" role="dialog" aria-labelledby="sendEmailSituationReportModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="sendEmailSituationReportModalLabel">Send situation report via email</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="email_for_situation_report">Send this to:</label>
                            <input type="text" class="form-control" id="email_for_situation_report" placeholder="example@email.com">
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="confirm_send_situation_report">Confirm</button>
        </div>
        </div>
    </div>
</div>