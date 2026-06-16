/**
 * RSVP -> Google Sheet
 * Dán toàn bộ file này vào Apps Script của Google Sheet nhận xác nhận.
 *
 * CÁCH LÀM (5 phút):
 * 1. Tạo 1 Google Sheet mới (sheet.new). Đặt tên ví dụ "RSVP Đám cưới".
 * 2. Menu Extensions (Tiện ích mở rộng) -> Apps Script.
 * 3. Xoá hết code mẫu, dán toàn bộ file này vào.
 * 4. Bấm Deploy (Triển khai) -> New deployment (Bản triển khai mới).
 *    - Select type (Chọn loại): Web app.
 *    - Description: rsvp
 *    - Execute as (Thực thi với tư cách): Me (chính bạn).
 *    - Who has access (Ai có quyền truy cập): Anyone (Bất kỳ ai).  <-- QUAN TRỌNG
 * 5. Bấm Deploy, cấp quyền (Authorize) khi Google hỏi.
 * 6. Copy "Web app URL" (dạng https://script.google.com/macros/s/..../exec)
 * 7. Mở index.html, tìm dòng:  const RSVP_ENDPOINT = "";
 *    Dán URL vào giữa hai dấu ngoặc kép.
 *
 * Mỗi lần khách bấm "Gửi xác nhận", một dòng mới sẽ tự thêm vào Sheet.
 * Nếu sau này sửa code này, nhớ Deploy -> Manage deployments -> Edit -> Version: New version.
 */

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // tạo header lần đầu
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Thời gian nhận', 'Họ và tên', 'Số người', 'Tham dự lễ', 'Lời chúc']);
    }

    var data = {};
    try { data = JSON.parse(e.postData.contents); } catch (err) { data = {}; }

    var now = new Date();
    var tz = 'Asia/Ho_Chi_Minh';
    var stamp = Utilities.formatDate(now, tz, 'dd/MM/yyyy HH:mm:ss');

    sheet.appendRow([
      stamp,
      data.name || '',
      data.count || '',
      data.which || '',
      data.msg || ''
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Mở URL .../exec bằng trình duyệt sẽ thấy dòng này -> chứng tỏ deploy thành công.
function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint dang hoat dong.')
    .setMimeType(ContentService.MimeType.TEXT);
}
