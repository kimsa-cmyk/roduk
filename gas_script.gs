// ============================================================
// rototobebe 로덬메이트 대시보드 — Google Apps Script API
// 배포: 확장 프로그램 > Apps Script > 배포 > 웹 앱
//       실행 계정: 본인 / 액세스 권한: 모든 사람(익명 포함)
// ============================================================

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('여름 활동 현황');
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({error:'시트를 찾을 수 없습니다.'}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  // 헤더: 6행(index 5), 데이터: 7행(index 6)~
  var rows = data.slice(6);

  var members = rows
    .filter(function(r) { return r[1] && r[1].toString().trim() !== ''; })
    .map(function(r) {
      return {
        no:     val(r[0]),       // A열: 번호
        name:   val(r[1]),       // B열: 이름
        insta:  val(r[4]),       // E열: 인스타그램
        gbn:    val(r[5]),       // F열: 구분
        gcol:   val(r[6]),       // G열
        drive:  val(r[8]),       // I열: 구글 드라이브 링크
        accum:  num(r[9]),       // J열: 누적 적립금
        w1:     num(r[20]),      // U열: 1주차 적립
        w2:     num(r[24])       // Y열: 2주차 적립금
      };
    });

  var result = {
    members: members,
    count:   members.length,
    updated: Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm')
  };

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function val(v) {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Seoul', 'yyyy-MM-dd');
  return v.toString().trim();
}

function num(v) {
  var n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}
