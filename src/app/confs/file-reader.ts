const  javascriptBaseFiles = [
  'assets/front-template/vendor/jquery/jquery.min.js',
  'assets/front-template/vendor/popper/popper.min.js',
  'assets/front-template/vendor/bootstrap/js/bootstrap.min.js',
  'assets/front-template/vendor/jquery-easing/jquery.easing.min.js',
  'assets/front-template/vendor/fontawesome-free/js/all.min.js',
  'assets/front-template/vendor/chart.js/Chart.min.js',
  'assets/front-template/js/sb-admin-2.min.js'
];
const  javascriptSituationalFiles = [
  'assets/front-template/js/demo/chart-pie-demo.js',
  'assets/front-template/js/demo/chart-area-demo.js',
  'assets/front-template/js/demo/chart-bar-demo.js',
  'assets/front-template/vendor/datatables/jquery.dataTables.min.js',
  'assets/front-template/vendor/datatables/dataTables.bootstrap4.min.js',
  'assets/front-template/js/demo/datatables-demo.js',
  'assets/front-template/vendor/jquery-confirm/jquery-confirm.min.js'
];
const cssFiles = [
   'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i'
 ];
export class FileReader {
  // ****************************************** JAVASCRIPT ********************************
  public static readJavascriptBaseFiles() {
    this.readJavascript(javascriptBaseFiles);
  }
  public static readJavascriptPieFiles() {
    this.readJavascript([javascriptSituationalFiles[0]]);
  }
  public static readJavascriptAreaFiles() {
    this.readJavascript([javascriptSituationalFiles[1]]);
  }
  public static readJavascriptBarFiles() {
    this.readJavascript([javascriptSituationalFiles[2]]);
  }
  public static readJavascriptDatatablesFiles() {
    this.readJavascript([javascriptSituationalFiles[3], javascriptSituationalFiles[4], javascriptSituationalFiles[5]]);
  }
  public static readJavascriptJqueryConfirmFile() {
    this.readJavascript([javascriptSituationalFiles[6]]);
  }
  private static readJavascript(scripts: Array<string>) {
    const countMax = scripts.length;
    for (let i = 0; i < countMax; i++) {
      const node = document.createElement('script');
      node.src = scripts [i];
      node.type = 'text/javascript';
      node.async = false;
      node.id = 'script' + i;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }
  // ****************************************** CSS ********************************
  public static readCssFiles() {
   this.readCss(cssFiles);
  }
  private static readCss(styles: Array<string>) {
    const countMax = styles.length;
    for (let i = 0; i < countMax; i++) {
      const node = document.createElement('link');
      node.href = styles[i];
      node.rel = 'stylesheet';
      node.id = 'link' + i;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }
}
