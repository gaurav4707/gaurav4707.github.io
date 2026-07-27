const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace(/\r\n/g, '\n');
content = content.replace(
  '            <p className="portrait-name"><span>//</span> Gaurav Kumar Verma</p>\n          </div>\n        </div>\n      </div>\n    </section>',
  '            <p className="portrait-name"><span>//</span> Gaurav Kumar Verma</p>\n          </div>\n        </div>\n        </PulsingBorder>\n      </div>\n    </section>'
);

// We also have a missing } or </> at line 1094.
// Let's check what's missing at the end of the file.
// The file should end with:
//   );
// }
// export default App;
// But maybe the `>` from <> was removed?
content = content.replace(
  '    {/**/}\n    </>\n  );\n}',
  '    {/*/} \n    </>\n  );\n}'
);

fs.writeFileSync('src/App.jsx', content);
