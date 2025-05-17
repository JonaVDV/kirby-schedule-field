(function () {
  "use strict";
  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
          ? global
          : typeof self !== "undefined"
            ? self
            : {};
  function getDefaultExportFromCjs(x) {
    return x &&
      x.__esModule &&
      Object.prototype.hasOwnProperty.call(x, "default")
      ? x["default"]
      : x;
  }
  var weekOfYear$1 = { exports: {} };
  (function (module, exports) {
    !(function (e, t) {
      module.exports = t();
    })(commonjsGlobal, function () {
      var e = "week",
        t = "year";
      return function (i, n, r) {
        var f = n.prototype;
        (f.week = function (i2) {
          if ((void 0 === i2 && (i2 = null), null !== i2))
            return this.add(7 * (i2 - this.week()), "day");
          var n2 = this.$locale().yearStart || 1;
          if (11 === this.month() && this.date() > 25) {
            var f2 = r(this).startOf(t).add(1, t).date(n2),
              s = r(this).endOf(e);
            if (f2.isBefore(s)) return 1;
          }
          var a = r(this)
              .startOf(t)
              .date(n2)
              .startOf(e)
              .subtract(1, "millisecond"),
            o = this.diff(a, e, true);
          return o < 0 ? r(this).startOf("week").week() : Math.ceil(o);
        }),
          (f.weeks = function (e2) {
            return void 0 === e2 && (e2 = null), this.week(e2);
          });
      };
    });
  })(weekOfYear$1);
  var weekOfYearExports = weekOfYear$1.exports;
  const weekOfYear = /* @__PURE__ */ getDefaultExportFromCjs(weekOfYearExports);
  var advancedFormat$1 = { exports: {} };
  (function (module, exports) {
    !(function (e, t) {
      module.exports = t();
    })(commonjsGlobal, function () {
      return function (e, t) {
        var r = t.prototype,
          n = r.format;
        r.format = function (e2) {
          var t2 = this,
            r2 = this.$locale();
          if (!this.isValid()) return n.bind(this)(e2);
          var s = this.$utils(),
            a = (e2 || "YYYY-MM-DDTHH:mm:ssZ").replace(
              /\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,
              function (e3) {
                switch (e3) {
                  case "Q":
                    return Math.ceil((t2.$M + 1) / 3);
                  case "Do":
                    return r2.ordinal(t2.$D);
                  case "gggg":
                    return t2.weekYear();
                  case "GGGG":
                    return t2.isoWeekYear();
                  case "wo":
                    return r2.ordinal(t2.week(), "W");
                  case "w":
                  case "ww":
                    return s.s(t2.week(), "w" === e3 ? 1 : 2, "0");
                  case "W":
                  case "WW":
                    return s.s(t2.isoWeek(), "W" === e3 ? 1 : 2, "0");
                  case "k":
                  case "kk":
                    return s.s(
                      String(0 === t2.$H ? 24 : t2.$H),
                      "k" === e3 ? 1 : 2,
                      "0",
                    );
                  case "X":
                    return Math.floor(t2.$d.getTime() / 1e3);
                  case "x":
                    return t2.$d.getTime();
                  case "z":
                    return "[" + t2.offsetName() + "]";
                  case "zzz":
                    return "[" + t2.offsetName("long") + "]";
                  default:
                    return e3;
                }
              },
            );
          return n.bind(this)(a);
        };
      };
    });
  })(advancedFormat$1);
  var advancedFormatExports = advancedFormat$1.exports;
  const advancedFormat = /* @__PURE__ */ getDefaultExportFromCjs(
    advancedFormatExports,
  );
  var nl = { exports: {} };
  var dayjs_min = { exports: {} };
  var hasRequiredDayjs_min;
  function requireDayjs_min() {
    if (hasRequiredDayjs_min) return dayjs_min.exports;
    hasRequiredDayjs_min = 1;
    (function (module, exports) {
      !(function (t, e) {
        module.exports = e();
      })(commonjsGlobal, function () {
        var t = 1e3,
          e = 6e4,
          n = 36e5,
          r = "millisecond",
          i = "second",
          s = "minute",
          u = "hour",
          a = "day",
          o = "week",
          c = "month",
          f = "quarter",
          h = "year",
          d = "date",
          l = "Invalid Date",
          $ =
            /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
          y =
            /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
          M = {
            name: "en",
            weekdays:
              "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
                "_",
              ),
            months:
              "January_February_March_April_May_June_July_August_September_October_November_December".split(
                "_",
              ),
            ordinal: function (t2) {
              var e2 = ["th", "st", "nd", "rd"],
                n2 = t2 % 100;
              return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
            },
          },
          m = function (t2, e2, n2) {
            var r2 = String(t2);
            return !r2 || r2.length >= e2
              ? t2
              : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
          },
          v = {
            s: m,
            z: function (t2) {
              var e2 = -t2.utcOffset(),
                n2 = Math.abs(e2),
                r2 = Math.floor(n2 / 60),
                i2 = n2 % 60;
              return (
                (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0")
              );
            },
            m: function t2(e2, n2) {
              if (e2.date() < n2.date()) return -t2(n2, e2);
              var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()),
                i2 = e2.clone().add(r2, c),
                s2 = n2 - i2 < 0,
                u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
              return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
            },
            a: function (t2) {
              return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
            },
            p: function (t2) {
              return (
                { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[
                  t2
                ] ||
                String(t2 || "")
                  .toLowerCase()
                  .replace(/s$/, "")
              );
            },
            u: function (t2) {
              return void 0 === t2;
            },
          },
          g = "en",
          D = {};
        D[g] = M;
        var p = "$isDayjsObject",
          S = function (t2) {
            return t2 instanceof _ || !(!t2 || !t2[p]);
          },
          w = function t2(e2, n2, r2) {
            var i2;
            if (!e2) return g;
            if ("string" == typeof e2) {
              var s2 = e2.toLowerCase();
              D[s2] && (i2 = s2), n2 && ((D[s2] = n2), (i2 = s2));
              var u2 = e2.split("-");
              if (!i2 && u2.length > 1) return t2(u2[0]);
            } else {
              var a2 = e2.name;
              (D[a2] = e2), (i2 = a2);
            }
            return !r2 && i2 && (g = i2), i2 || (!r2 && g);
          },
          O = function (t2, e2) {
            if (S(t2)) return t2.clone();
            var n2 = "object" == typeof e2 ? e2 : {};
            return (n2.date = t2), (n2.args = arguments), new _(n2);
          },
          b = v;
        (b.l = w),
          (b.i = S),
          (b.w = function (t2, e2) {
            return O(t2, {
              locale: e2.$L,
              utc: e2.$u,
              x: e2.$x,
              $offset: e2.$offset,
            });
          });
        var _ = (function () {
            function M2(t2) {
              (this.$L = w(t2.locale, null, true)),
                this.parse(t2),
                (this.$x = this.$x || t2.x || {}),
                (this[p] = true);
            }
            var m2 = M2.prototype;
            return (
              (m2.parse = function (t2) {
                (this.$d = (function (t3) {
                  var e2 = t3.date,
                    n2 = t3.utc;
                  if (null === e2) return /* @__PURE__ */ new Date(NaN);
                  if (b.u(e2)) return /* @__PURE__ */ new Date();
                  if (e2 instanceof Date) return new Date(e2);
                  if ("string" == typeof e2 && !/Z$/i.test(e2)) {
                    var r2 = e2.match($);
                    if (r2) {
                      var i2 = r2[2] - 1 || 0,
                        s2 = (r2[7] || "0").substring(0, 3);
                      return n2
                        ? new Date(
                            Date.UTC(
                              r2[1],
                              i2,
                              r2[3] || 1,
                              r2[4] || 0,
                              r2[5] || 0,
                              r2[6] || 0,
                              s2,
                            ),
                          )
                        : new Date(
                            r2[1],
                            i2,
                            r2[3] || 1,
                            r2[4] || 0,
                            r2[5] || 0,
                            r2[6] || 0,
                            s2,
                          );
                    }
                  }
                  return new Date(e2);
                })(t2)),
                  this.init();
              }),
              (m2.init = function () {
                var t2 = this.$d;
                (this.$y = t2.getFullYear()),
                  (this.$M = t2.getMonth()),
                  (this.$D = t2.getDate()),
                  (this.$W = t2.getDay()),
                  (this.$H = t2.getHours()),
                  (this.$m = t2.getMinutes()),
                  (this.$s = t2.getSeconds()),
                  (this.$ms = t2.getMilliseconds());
              }),
              (m2.$utils = function () {
                return b;
              }),
              (m2.isValid = function () {
                return !(this.$d.toString() === l);
              }),
              (m2.isSame = function (t2, e2) {
                var n2 = O(t2);
                return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
              }),
              (m2.isAfter = function (t2, e2) {
                return O(t2) < this.startOf(e2);
              }),
              (m2.isBefore = function (t2, e2) {
                return this.endOf(e2) < O(t2);
              }),
              (m2.$g = function (t2, e2, n2) {
                return b.u(t2) ? this[e2] : this.set(n2, t2);
              }),
              (m2.unix = function () {
                return Math.floor(this.valueOf() / 1e3);
              }),
              (m2.valueOf = function () {
                return this.$d.getTime();
              }),
              (m2.startOf = function (t2, e2) {
                var n2 = this,
                  r2 = !!b.u(e2) || e2,
                  f2 = b.p(t2),
                  l2 = function (t3, e3) {
                    var i2 = b.w(
                      n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3),
                      n2,
                    );
                    return r2 ? i2 : i2.endOf(a);
                  },
                  $2 = function (t3, e3) {
                    return b.w(
                      n2
                        .toDate()
                        [
                          t3
                        ].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59,
                                59, 999]).slice(e3)),
                      n2,
                    );
                  },
                  y2 = this.$W,
                  M3 = this.$M,
                  m3 = this.$D,
                  v2 = "set" + (this.$u ? "UTC" : "");
                switch (f2) {
                  case h:
                    return r2 ? l2(1, 0) : l2(31, 11);
                  case c:
                    return r2 ? l2(1, M3) : l2(0, M3 + 1);
                  case o:
                    var g2 = this.$locale().weekStart || 0,
                      D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
                    return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
                  case a:
                  case d:
                    return $2(v2 + "Hours", 0);
                  case u:
                    return $2(v2 + "Minutes", 1);
                  case s:
                    return $2(v2 + "Seconds", 2);
                  case i:
                    return $2(v2 + "Milliseconds", 3);
                  default:
                    return this.clone();
                }
              }),
              (m2.endOf = function (t2) {
                return this.startOf(t2, false);
              }),
              (m2.$set = function (t2, e2) {
                var n2,
                  o2 = b.p(t2),
                  f2 = "set" + (this.$u ? "UTC" : ""),
                  l2 = ((n2 = {}),
                  (n2[a] = f2 + "Date"),
                  (n2[d] = f2 + "Date"),
                  (n2[c] = f2 + "Month"),
                  (n2[h] = f2 + "FullYear"),
                  (n2[u] = f2 + "Hours"),
                  (n2[s] = f2 + "Minutes"),
                  (n2[i] = f2 + "Seconds"),
                  (n2[r] = f2 + "Milliseconds"),
                  n2)[o2],
                  $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
                if (o2 === c || o2 === h) {
                  var y2 = this.clone().set(d, 1);
                  y2.$d[l2]($2),
                    y2.init(),
                    (this.$d = y2.set(
                      d,
                      Math.min(this.$D, y2.daysInMonth()),
                    ).$d);
                } else l2 && this.$d[l2]($2);
                return this.init(), this;
              }),
              (m2.set = function (t2, e2) {
                return this.clone().$set(t2, e2);
              }),
              (m2.get = function (t2) {
                return this[b.p(t2)]();
              }),
              (m2.add = function (r2, f2) {
                var d2,
                  l2 = this;
                r2 = Number(r2);
                var $2 = b.p(f2),
                  y2 = function (t2) {
                    var e2 = O(l2);
                    return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
                  };
                if ($2 === c) return this.set(c, this.$M + r2);
                if ($2 === h) return this.set(h, this.$y + r2);
                if ($2 === a) return y2(1);
                if ($2 === o) return y2(7);
                var M3 =
                    ((d2 = {}), (d2[s] = e), (d2[u] = n), (d2[i] = t), d2)[
                      $2
                    ] || 1,
                  m3 = this.$d.getTime() + r2 * M3;
                return b.w(m3, this);
              }),
              (m2.subtract = function (t2, e2) {
                return this.add(-1 * t2, e2);
              }),
              (m2.format = function (t2) {
                var e2 = this,
                  n2 = this.$locale();
                if (!this.isValid()) return n2.invalidDate || l;
                var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ",
                  i2 = b.z(this),
                  s2 = this.$H,
                  u2 = this.$m,
                  a2 = this.$M,
                  o2 = n2.weekdays,
                  c2 = n2.months,
                  f2 = n2.meridiem,
                  h2 = function (t3, n3, i3, s3) {
                    return (
                      (t3 && (t3[n3] || t3(e2, r2))) || i3[n3].slice(0, s3)
                    );
                  },
                  d2 = function (t3) {
                    return b.s(s2 % 12 || 12, t3, "0");
                  },
                  $2 =
                    f2 ||
                    function (t3, e3, n3) {
                      var r3 = t3 < 12 ? "AM" : "PM";
                      return n3 ? r3.toLowerCase() : r3;
                    };
                return r2.replace(y, function (t3, r3) {
                  return (
                    r3 ||
                    (function (t4) {
                      switch (t4) {
                        case "YY":
                          return String(e2.$y).slice(-2);
                        case "YYYY":
                          return b.s(e2.$y, 4, "0");
                        case "M":
                          return a2 + 1;
                        case "MM":
                          return b.s(a2 + 1, 2, "0");
                        case "MMM":
                          return h2(n2.monthsShort, a2, c2, 3);
                        case "MMMM":
                          return h2(c2, a2);
                        case "D":
                          return e2.$D;
                        case "DD":
                          return b.s(e2.$D, 2, "0");
                        case "d":
                          return String(e2.$W);
                        case "dd":
                          return h2(n2.weekdaysMin, e2.$W, o2, 2);
                        case "ddd":
                          return h2(n2.weekdaysShort, e2.$W, o2, 3);
                        case "dddd":
                          return o2[e2.$W];
                        case "H":
                          return String(s2);
                        case "HH":
                          return b.s(s2, 2, "0");
                        case "h":
                          return d2(1);
                        case "hh":
                          return d2(2);
                        case "a":
                          return $2(s2, u2, true);
                        case "A":
                          return $2(s2, u2, false);
                        case "m":
                          return String(u2);
                        case "mm":
                          return b.s(u2, 2, "0");
                        case "s":
                          return String(e2.$s);
                        case "ss":
                          return b.s(e2.$s, 2, "0");
                        case "SSS":
                          return b.s(e2.$ms, 3, "0");
                        case "Z":
                          return i2;
                      }
                      return null;
                    })(t3) ||
                    i2.replace(":", "")
                  );
                });
              }),
              (m2.utcOffset = function () {
                return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
              }),
              (m2.diff = function (r2, d2, l2) {
                var $2,
                  y2 = this,
                  M3 = b.p(d2),
                  m3 = O(r2),
                  v2 = (m3.utcOffset() - this.utcOffset()) * e,
                  g2 = this - m3,
                  D2 = function () {
                    return b.m(y2, m3);
                  };
                switch (M3) {
                  case h:
                    $2 = D2() / 12;
                    break;
                  case c:
                    $2 = D2();
                    break;
                  case f:
                    $2 = D2() / 3;
                    break;
                  case o:
                    $2 = (g2 - v2) / 6048e5;
                    break;
                  case a:
                    $2 = (g2 - v2) / 864e5;
                    break;
                  case u:
                    $2 = g2 / n;
                    break;
                  case s:
                    $2 = g2 / e;
                    break;
                  case i:
                    $2 = g2 / t;
                    break;
                  default:
                    $2 = g2;
                }
                return l2 ? $2 : b.a($2);
              }),
              (m2.daysInMonth = function () {
                return this.endOf(c).$D;
              }),
              (m2.$locale = function () {
                return D[this.$L];
              }),
              (m2.locale = function (t2, e2) {
                if (!t2) return this.$L;
                var n2 = this.clone(),
                  r2 = w(t2, e2, true);
                return r2 && (n2.$L = r2), n2;
              }),
              (m2.clone = function () {
                return b.w(this.$d, this);
              }),
              (m2.toDate = function () {
                return new Date(this.valueOf());
              }),
              (m2.toJSON = function () {
                return this.isValid() ? this.toISOString() : null;
              }),
              (m2.toISOString = function () {
                return this.$d.toISOString();
              }),
              (m2.toString = function () {
                return this.$d.toUTCString();
              }),
              M2
            );
          })(),
          k = _.prototype;
        return (
          (O.prototype = k),
          [
            ["$ms", r],
            ["$s", i],
            ["$m", s],
            ["$H", u],
            ["$W", a],
            ["$M", c],
            ["$y", h],
            ["$D", d],
          ].forEach(function (t2) {
            k[t2[1]] = function (e2) {
              return this.$g(e2, t2[0], t2[1]);
            };
          }),
          (O.extend = function (t2, e2) {
            return t2.$i || (t2(e2, _, O), (t2.$i = true)), O;
          }),
          (O.locale = w),
          (O.isDayjs = S),
          (O.unix = function (t2) {
            return O(1e3 * t2);
          }),
          (O.en = D[g]),
          (O.Ls = D),
          (O.p = {}),
          O
        );
      });
    })(dayjs_min);
    return dayjs_min.exports;
  }
  (function (module, exports) {
    !(function (e, a) {
      module.exports = a(requireDayjs_min());
    })(commonjsGlobal, function (e) {
      function a(e2) {
        return e2 && "object" == typeof e2 && "default" in e2
          ? e2
          : { default: e2 };
      }
      var d = a(e),
        n = {
          name: "nl",
          weekdays:
            "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split(
              "_",
            ),
          weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
          weekdaysMin: "zo_ma_di_wo_do_vr_za".split("_"),
          months:
            "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split(
              "_",
            ),
          monthsShort: "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split(
            "_",
          ),
          ordinal: function (e2) {
            return (
              "[" + e2 + (1 === e2 || 8 === e2 || e2 >= 20 ? "ste" : "de") + "]"
            );
          },
          weekStart: 1,
          yearStart: 4,
          formats: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "DD-MM-YYYY",
            LL: "D MMMM YYYY",
            LLL: "D MMMM YYYY HH:mm",
            LLLL: "dddd D MMMM YYYY HH:mm",
          },
          relativeTime: {
            future: "over %s",
            past: "%s geleden",
            s: "een paar seconden",
            m: "een minuut",
            mm: "%d minuten",
            h: "een uur",
            hh: "%d uur",
            d: "een dag",
            dd: "%d dagen",
            M: "een maand",
            MM: "%d maanden",
            y: "een jaar",
            yy: "%d jaar",
          },
        };
      return d.default.locale(n, null, true), n;
    });
  })(nl);
  var nlExports = nl.exports;
  const LangNl = /* @__PURE__ */ getDefaultExportFromCjs(nlExports);
  var isBetween$1 = { exports: {} };
  (function (module, exports) {
    !(function (e, i) {
      module.exports = i();
    })(commonjsGlobal, function () {
      return function (e, i, t) {
        i.prototype.isBetween = function (e2, i2, s, f) {
          var n = t(e2),
            o = t(i2),
            r = "(" === (f = f || "()")[0],
            u = ")" === f[1];
          return (
            ((r ? this.isAfter(n, s) : !this.isBefore(n, s)) &&
              (u ? this.isBefore(o, s) : !this.isAfter(o, s))) ||
            ((r ? this.isBefore(n, s) : !this.isAfter(n, s)) &&
              (u ? this.isAfter(o, s) : !this.isBefore(o, s)))
          );
        };
      };
    });
  })(isBetween$1);
  var isBetweenExports = isBetween$1.exports;
  const isBetween = /* @__PURE__ */ getDefaultExportFromCjs(isBetweenExports);
  function openTimeDialog(onSubmit, event) {
    console.log("openTimeDialog called with event:", event);
    window.panel.dialog.open({
      component: "k-form-dialog",
      props: {
        fields: {
          start: {
            label: window.panel.$t("dialog.event.edit.start"),
            type: "time",
            required: true,
          },
          end: {
            label: window.panel.$t("dialog.event.edit.end"),
            type: "time",
            required: true,
          },
          recurring: {
            label: window.panel.$t("dialog.event.time.recurring"),
            type: "toggle",
            help: window.panel.$t("dialog.event.time.recurring.help"),
            // Translate help text
            default: false,
            required: false,
          },
          recurringEndDate: {
            when: {
              recurring: true,
            },
            label: window.panel.$t("dialog.event.time.recurringEndDate"),
            type: "date",
            time: false,
            help: window.panel.$t("dialog.event.time.recurringEndDate.help"),
            required: false,
            min: /* @__PURE__ */ new Date().toISOString().split("T")[0],
          },
        },
        value: {
          start: event.startTime || "00:00:00",
          end: event.endTime || "00:00:00",
          recurring: false,
          recurringEndDate: null,
        },
      },
      on: {
        submit: (data) => {
          console.log("onSubmit called with data:", data);
          onSubmit(data);
          window.panel.dialog.close();
        },
      },
    });
  }
  function eventEditDialog(onSubmit, event) {
    const dayIndex = event.dayOfWeek;
    window.panel.dialog.open({
      component: "k-form-dialog",
      props: {
        fields: {
          day: {
            label: window.panel.$t("dialog.event.edit.day"),
            type: "select",
            options: [
              {
                value: 0,
                text: window.panel.$t("dialog.event.edit.day.sunday"),
              },
              // Translate day
              {
                value: 1,
                text: window.panel.$t("dialog.event.edit.day.monday"),
              },
              // Translate day
              {
                value: 2,
                text: window.panel.$t("dialog.event.edit.day.tuesday"),
              },
              // Translate day
              {
                value: 3,
                text: window.panel.$t("dialog.event.edit.day.wednesday"),
              },
              // Translate day
              {
                value: 4,
                text: window.panel.$t("dialog.event.edit.day.thursday"),
              },
              // Translate day
              {
                value: 5,
                text: window.panel.$t("dialog.event.edit.day.friday"),
              },
              // Translate day
              {
                value: 6,
                text: window.panel.$t("dialog.event.edit.day.saturday"),
              },
              // Translate day
            ],
          },
          start: {
            label: window.panel.$t("dialog.event.edit.start"),
            type: "time",
            required: true,
          },
          end: {
            label: window.panel.$t("dialog.event.edit.end"),
            type: "time",
            required: true,
          },
          recurring: {
            label: window.panel.$t("dialog.event.time.recurring"),
            type: "toggle",
            help: window.panel.$t("dialog.event.time.recurring.help"),
            // Translate help text
            default: false,
            required: false,
          },
          recurringEndDate: {
            when: {
              recurring: true,
            },
            label: window.panel.$t("dialog.event.time.recurringEndDate"),
            type: "date",
            time: false,
            help: window.panel.$t("dialog.event.time.recurringEndDate.help"),
            required: false,
            min: /* @__PURE__ */ new Date().toISOString().split("T")[0],
          },
        },
        value: {
          day: dayIndex,
          start: event.startTime || "00:00:00",
          end: event.endTime || "00:00:00",
          recurring: event.recurring || false,
          recurringEndDate: event.recurringEndDate || null,
        },
      },
      on: {
        submit: (data) => {
          onSubmit(data);
          window.panel.dialog.close();
        },
      },
    });
  }
  function openDeleteDialog(onSubmit) {
    window.panel.dialog.open({
      component: "k-remove-dialog",
      props: {
        text: window.panel.$t("dialog.event.delete.confirm"),
        // Translate text
      },
      on: {
        submit: () => {
          onSubmit();
          window.panel.dialog.close();
        },
      },
    });
  }
  function openFormDrawerAsync(fields, initialValue = {}, options) {
    return new Promise((resolve, reject) => {
      const drawerOptions = {
        component: "k-form-drawer",
        props: {
          fields,
          value: initialValue,
          ...options,
        },
        on: {
          submit: (data) => {
            window.panel.drawer.close();
            resolve(data);
          },
        },
      };
      window.panel.drawer.open(drawerOptions);
    });
  }
  function normalizeComponent(
    scriptExports,
    render,
    staticRenderFns,
    functionalTemplate,
    injectStyles,
    scopeId,
    moduleIdentifier,
    shadowMode,
  ) {
    var options =
      typeof scriptExports === "function"
        ? scriptExports.options
        : scriptExports;
    if (render) {
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      options._compiled = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    return {
      exports: scriptExports,
      options,
    };
  }
  const __default__ = Vue.defineComponent({
    props: {
      event: {
        /**
         * The event object.
         * @type {import('vue').PropType<Event>}
         */
        type: Object,
        required: true,
      },
    },
    inject: ["allItems"],
    methods: {
      /**
       *
       * @param event {Event}
       */
      deleteEvent(event) {
        openDeleteDialog(() => {
          console.log("Deleting event:", event);
          this.$emit("delete-event", event.instanceId);
        });
      },
      /**
       * Opens the edit dialog for the event. and returns the new values.
       * @param event {Event}
       */
      editEvent(event) {
        eventEditDialog((newValues) => {
          this.$emit("edit-event", event.instanceId, newValues);
        }, event);
      },
      handleAction(action) {
        switch (action) {
          case "edit":
            this.editEvent(this.event);
            break;
          case "delete":
            this.deleteEvent(this.event);
            break;
          default:
            console.warn("Unknown action:", action);
        }
      },
    },
    computed: {
      /**
       * Returns the item object for the event.
       * @returns {import('./create-item.vue').Item | undefined}
       */
      item() {
        return this.allItems.find((item) => item.id === this.event.itemId);
      },
      duration() {
        return Number(this.event.duration) || 1;
      },
      cssTopValue() {
        const startTime = this.event.startTime.split(":");
        Number(startTime[0]);
        const startMinute = Number(startTime[1]);
        const t = (1 / 60) * startMinute;
        return t * 100;
      },
      /**
       * @typedef {Object} ItemOption
       * @property {string} text - The text to display for the option.
       * @property {string} icon - The icon to display for the option.
       * @property {string} click - The action to perform when the option is selected.
       * @property {string} [theme] - The theme for the option.
       *
       * @returns {ItemOption[]}
       */
      itemOptions() {
        return [
          { text: this.$t("dropdown.edit"), icon: "edit", click: "edit" },
          // Translate text
          {
            text: this.$t("dropdown.delete"),
            icon: "trash",
            click: "delete",
            theme: "negative",
          },
          // Translate text
        ];
      },
    },
    emits: ["delete-event", "edit-event"],
  });
  const __injectCSSVars__ = () => {
    Vue.useCssVars((_vm, _setup) => {
      var _a;
      return {
        "71961a44-duration": _vm.duration,
        "71961a44-item__color": (_a = _vm.item) == null ? void 0 : _a.color,
      };
    });
  };
  const __setup__ = __default__.setup;
  __default__.setup = __setup__
    ? (props, ctx) => {
        __injectCSSVars__();
        return __setup__(props, ctx);
      }
    : __injectCSSVars__;
  const _sfc_main$3 = __default__;
  var _sfc_render$3 = function render() {
    var _a, _b;
    var _vm = this,
      _c = _vm._self._c;
    _vm._self._setupProxy;
    return _c(
      "li",
      {
        staticClass: "event",
        style: { top: _vm.cssTopValue + "%" },
        on: {
          dblclick: function ($event) {
            $event.stopPropagation();
            return _vm.editEvent(_vm.event);
          },
        },
      },
      [
        _c("div", { staticClass: "event-content" }, [
          _c("span", { staticClass: "event-title" }, [
            _vm._v(_vm._s((_a = _vm.item) == null ? void 0 : _a.title)),
          ]),
          _c("span", { staticClass: "event-time" }, [
            _vm._v(
              _vm._s(_vm.event.startTime.substring(0, 5)) +
                " - " +
                _vm._s(_vm.event.endTime.substring(0, 5)),
            ),
          ]),
          _c("span", { staticClass: "event-location" }, [
            _vm._v(_vm._s((_b = _vm.item) == null ? void 0 : _b.location)),
          ]),
        ]),
        _c("k-options-dropdown", {
          staticClass: "event-options-trigger",
          attrs: {
            options: _vm.itemOptions,
            text: false,
            icon: "dots",
            size: "xs",
          },
          on: {
            action: function ($event) {
              return _vm.handleAction($event);
            },
          },
        }),
      ],
      1,
    );
  };
  var _sfc_staticRenderFns$3 = [];
  _sfc_render$3._withStripped = true;
  var __component__$3 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$3,
    _sfc_render$3,
    _sfc_staticRenderFns$3,
    false,
    null,
    "71961a44",
  );
  __component__$3.options.__file =
    "/home/jona-vdv/Documents/programming/projects/kirby-schedule-field/packages/kirby-schedule-field/src/components/schedule-event-item.vue";
  const ScheduleEventItem = __component__$3.exports;
  requireDayjs_min();
  const _sfc_main$2 = Vue.defineComponent({
    components: {
      ScheduleEventItem,
    },
    props: {
      timeRangeStart: Number,
      timeRangeEnd: Number,
      currentLocale: {
        type: String,
      },
      currentDay: {
        /**
         * @type {import('vue').PropType<Dayjs>}
         */
        type: Object,
      },
    },
    data() {
      return {
        currentDay: this.$library.dayjs(),
        /**
         * @type {import('./schedule-event-item.vue').Event[]}
         */
        tempEvents: [],
        draggedEventInstanceId: null,
      };
    },
    beforeMount() {
      this.$library.dayjs.locale(this.currentLocale);
      console.log("Current locale:", this.$library.dayjs.locale());
    },
    inject: ["allEvents", "allItems"],
    methods: {
      /**
       * @param targetDate {Dayjs}
       * @param changeEvent {DragEvent}
       * @param targetHour {number}
       */
      handleItemDrop(changeEvent, targetDate, targetHour) {
        if (changeEvent.removed || changeEvent.moved) {
          return;
        }
        if (changeEvent.added) {
          if (this.draggedEventInstanceId) {
            const event = this.events.find((e) => {
              return e.instanceId === this.draggedEventInstanceId;
            });
            if (!event) {
              console.error("Event not found for dragged instance ID.");
              return;
            }
            this.handleMove(event, targetDate.day(), targetHour);
          } else if (
            changeEvent.added.element &&
            changeEvent.added.element.id &&
            !changeEvent.added.element.instanceId
          ) {
            const addedElement = changeEvent.added.element;
            const targetStartTime =
              String(targetHour).padStart(2, "0") + ":00:00";
            const targetEndTime =
              String(targetHour + 1).padStart(2, "0") + ":00:00";
            openTimeDialog(
              (timeData) => {
                const startTime = timeData.start;
                const endTime = timeData.end;
                const startDateTime = this.$library.dayjs(
                  `2000-01-01 ${startTime}`,
                );
                const endDateTime = this.$library.dayjs(
                  `2000-01-01 ${endTime}`,
                );
                const duration = endDateTime.diff(startDateTime, "minute");
                const durationInHours = Math.round((duration / 60) * 1e3) / 1e3;
                const newEvent = {
                  /* ... create event object ... */
                  itemId: addedElement.id,
                  instanceId: this.$helper.string.uuid(),
                  dayOfWeek: targetDate.day(),
                  startDate: targetDate.format("YYYY-MM-DD"),
                  startTime: timeData.start,
                  endTime: timeData.end,
                  duration: durationInHours,
                  recurring: timeData.recurring,
                  recurringEndDate: timeData.recurring
                    ? timeData.recurringEndDate
                    : null,
                };
                this.$emit("create-event", newEvent);
              },
              {
                startTime: targetStartTime,
                endTime: targetEndTime,
                recurring: false,
                recurringEndDate: null,
              },
            );
          } else {
            console.log(
              "Added event occurred, but it wasn't a tracked move or a recognized new item.",
              changeEvent.added,
            );
          }
        }
      },
      /**
       * @param dragEvent {DragEvent}
       *
       */
      handleDragStart(dragEvent) {
        if (!dragEvent.item && !dragEvent.item.__vue__) {
          return null;
        }
        const eventData = dragEvent.item.__vue__.event;
        if (!eventData || !eventData.instanceId) {
          return null;
        }
        this.draggedEventInstanceId = eventData.instanceId;
      },
      /**
       *
       */
      handleDragEnd() {
        this.draggedEventInstanceId = null;
      },
      /**
       *
       * @param {import('./schedule-event-item.vue').Event} event
       * @param {number} newDayIndex
       * @param {number} newStartHour
       */
      handleMove(event, newDayIndex, newStartHour) {
        const newStartTime = String(newStartHour).padStart(2, "0") + ":00:00";
        const currentStartDate = this.$library.dayjs(event.startDate);
        const newStartDate = currentStartDate
          .startOf("week")
          .add(newDayIndex, "day")
          .format("YYYY-MM-DD");
        const newEvent = {
          startDate: newStartDate,
          startTime: newStartTime,
          dayOfWeek: newDayIndex,
        };
        this.$emit("move-event", {
          instanceId: event.instanceId,
          newValues: newEvent,
        });
      },
      /**
       *
       * @param dayIndex {number}
       * @param dayOfWeek {number}
       * @param startHour {number}
       *
       *
       * @return {import('./schedule-event-item.vue').Event[]}
       */
      getEventsForslot(dayIndex, startHour) {
        const slotDate = this.startOfWeek.add(dayIndex, "day");
        const formattedSlotDate = slotDate.format("YYYY-MM-DD");
        String(startHour).padStart(2, "0") + ":00:00";
        const filteredEvents = this.events.filter((event) => {
          if (
            event.dayOfWeek !== dayIndex ||
            parseInt(event.startTime.split(":")[0], 10) !== startHour
          ) {
            return false;
          }
          if (!event.recurring) {
            return event.startDate === formattedSlotDate;
          } else {
            const eventStartDate = this.$library.dayjs(event.startDate);
            const eventRecurringEndDate = this.$library.dayjs(
              event.recurringEndDate,
            );
            if (slotDate.isBefore(eventStartDate, "day")) {
              return false;
            }
            if (!event.recurringEndDate) {
              return true;
            }
            return slotDate.isBetween(
              eventStartDate,
              eventRecurringEndDate,
              "day",
              "[]",
            );
          }
        });
        return filteredEvents;
      },
      /**
       *
       * @param index {number}
       * @param eventsInSlot {Array<import('./schedule-event-item.vue').Event>}
       * @returns {{
       *    '--event-left': string,
       *   '--event-width': string} | {}}
       */
      getEventDynamicStyle(index, eventsInSlot) {
        const totalEvents = eventsInSlot.length;
        if (totalEvents === 0) {
          return {};
        }
        return {
          "--event-left": `${index * (100 / totalEvents)}%`,
          "--event-width": `${100 / totalEvents}%`,
        };
      },
    },
    computed: {
      /**
       * @returns {number[]} - The list of times in the range from timeRangeStart to timeRangeEnd.
       */
      getTimeRange() {
        return Array.from(
          { length: this.timeRangeEnd - this.timeRangeStart + 1 },
          (_, i) => i + this.timeRangeStart,
        );
      },
      startOfWeek() {
        return this.currentDay.startOf("week");
      },
      endOfWeek() {
        return this.currentDay.endOf("week");
      },
      datesOfCurrentWeek() {
        return Array.from({ length: 7 }, (_, i) =>
          this.startOfWeek.add(i, "day"),
        );
      },
      /**
       * @return {import('./schedule-event-item.vue').Event[]}
       */
      events() {
        return this.allEvents;
      },
      displayWeeklabel() {
        return this.endOfWeek.format("YYYY-ww");
      },
      draggableOptions() {
        return {
          group: {
            name: "schedule-items",
            pull: true,
            put: true,
          },
        };
      },
    },
    emits: ["delete-event", "edit-event", "create-event", "move-event"],
  });
  var _sfc_render$2 = function render() {
    var _vm = this,
      _c = _vm._self._c;
    _vm._self._setupProxy;
    return _c("div", {}, [
      _c("table", { staticClass: "schedule-grid" }, [
        _c("thead", [
          _c(
            "tr",
            { staticClass: "schedule-header" },
            [
              _c("th", { staticClass: "time-header" }, [
                _vm._v(_vm._s(_vm.$t("field.schedule.time"))),
              ]),
              _vm._l(_vm.datesOfCurrentWeek, function (date, dayIndex) {
                return _c(
                  "th",
                  {
                    key: date.format("YYYY-MM-DD"),
                    staticClass: "day-header",
                    class: {
                      "hidden-mobile": dayIndex !== _vm.currentDay.day(),
                    },
                    attrs: { "data-mobile": "true" },
                  },
                  [
                    _c("span", [
                      _vm._v(" " + _vm._s(date.format("dddd")) + " "),
                    ]),
                    _c("span", [
                      _vm._v(" " + _vm._s(date.format("MMM-DD")) + " "),
                    ]),
                  ],
                );
              }),
            ],
            2,
          ),
        ]),
        _c(
          "tbody",
          _vm._l(_vm.getTimeRange, function (hour) {
            return _c(
              "tr",
              { key: hour, staticClass: "schedule-slots" },
              [
                _c(
                  "td",
                  {
                    staticClass: "time-cell",
                    attrs: { "data-mobile": "true" },
                  },
                  [
                    _vm._v(
                      " " + _vm._s(String(hour).padStart(2, "0")) + ":00 ",
                    ),
                  ],
                ),
                _vm._l(_vm.datesOfCurrentWeek, function (date, dayIndex) {
                  return _c(
                    "td",
                    {
                      key: date.format("dddd") + "-" + hour,
                      staticClass: "schedule-cell",
                      class: {
                        "active-day-cell": _vm.currentDay.day() === dayIndex,
                        "hidden-mobile": dayIndex !== _vm.currentDay.day(),
                      },
                      attrs: {
                        "data-day": date.format("dddd"),
                        "data-hour": hour,
                        "data-mobile": "true",
                      },
                    },
                    [
                      _c(
                        "k-draggable",
                        {
                          staticClass: "target-list",
                          attrs: {
                            options: _vm.draggableOptions,
                            list: _vm.getEventsForslot(dayIndex, hour),
                          },
                          on: {
                            change: function ($event) {
                              return _vm.handleItemDrop($event, date, hour);
                            },
                            start: _vm.handleDragStart,
                            end: _vm.handleDragEnd,
                          },
                        },
                        _vm._l(
                          _vm.getEventsForslot(dayIndex, hour),
                          function (event, index) {
                            return _c("ScheduleEventItem", {
                              key: event.instanceId,
                              style: _vm.getEventDynamicStyle(
                                index,
                                _vm.getEventsForslot(dayIndex, hour),
                              ),
                              attrs: { event: event },
                              on: {
                                "delete-event": function ($event) {
                                  return _vm.$emit(
                                    "delete-event",
                                    event.instanceId,
                                  );
                                },
                                "edit-event": (instanceId, newValues) =>
                                  _vm.$emit(
                                    "edit-event",
                                    instanceId,
                                    newValues,
                                  ),
                              },
                            });
                          },
                        ),
                        1,
                      ),
                    ],
                    1,
                  );
                }),
              ],
              2,
            );
          }),
          0,
        ),
      ]),
    ]);
  };
  var _sfc_staticRenderFns$2 = [];
  _sfc_render$2._withStripped = true;
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    _sfc_render$2,
    _sfc_staticRenderFns$2,
    false,
    null,
    null,
  );
  __component__$2.options.__file =
    "/home/jona-vdv/Documents/programming/projects/kirby-schedule-field/packages/kirby-schedule-field/src/components/schedule-table.vue";
  const ScheduleTable = __component__$2.exports;
  function openItemDeleteDialog(item, onSubmit) {
    window.panel.dialog.open({
      props: {
        text: window.panel.$t("dialog.item.delete.confirm", {
          title: item.title,
        }),
        // Translate text with variable
        title: window.panel.$t("dialog.item.delete.title"),
        // Translate title
      },
      component: "k-remove-dialog",
      on: {
        submit: () => {
          onSubmit(item);
          window.panel.dialog.close();
        },
      },
    });
  }
  const _sfc_main$1 = Vue.defineComponent({
    extends: "k-structure-field",
    props: {
      items: {
        /**
         * @type {import('vue').PropType<Item[]>}
         */
        type: Array,
        required: true,
      },
      fields: {
        /**
         * @type {import('vue').PropType<import('../../plugin.d.ts').FieldsDefinition>}
         */
        type: [Object],
        // Matches the 'create' prop type from parent
        required: true,
      },
      endpoints: {
        type: Object,
      },
    },
    computed: {
      sourceOptions() {
        return {
          group: {
            name: "schedule-items",
            pull: "clone",
            put: false,
          },
        };
      },
      itemOptions() {
        return [
          {
            text: this.$t("dropdown.edit"),
            // Translate text
            icon: "edit",
            click: "edit",
          },
          {
            text: this.$t("dropdown.delete"),
            // Translate text
            icon: "trash",
            click: "delete",
          },
        ];
      },
    },
    methods: {
      /**
       *
       * @param action {string}
       * @param item {Item}
       */
      handleAction(action, item) {
        switch (action) {
          case "edit":
            this.editItem(item, item.id);
            break;
          case "delete":
            this.deleteItem(item);
            break;
        }
      },
      form() {
        const fields = this.$helper.field.subfields(this, this.fields);
        console.log("Form fields:", fields);
        return fields;
      },
      async openItemAdd() {
        const data = await openFormDrawerAsync(this.form(), {}, {});
        if (data) {
          console.log(data);
          this.$emit("add-items", data);
        }
      },
      /**
       *
       * @param {Item} item
       * @param {string} id
       */
      async editItem(item, id) {
        const data = await openFormDrawerAsync(this.form(), item, {});
        if (data) {
          this.$emit("edit-items", data, id);
        }
      },
      /**
       *
       * @param {Item} item
       */
      deleteItem(item) {
        this.$emit("delete-items", item);
      },
    },
    emits: ["add-items", "edit-items", "delete-items"],
  });
  var _sfc_render$1 = function render() {
    var _vm = this,
      _c = _vm._self._c;
    _vm._self._setupProxy;
    return _c(
      "k-field",
      _vm._b(
        { staticClass: "k-schedule-items-container" },
        "k-field",
        _vm.$props,
        false,
      ),
      [
        _c(
          "k-button",
          { attrs: { icon: "add" }, on: { click: _vm.openItemAdd } },
          [_vm._v(" " + _vm._s(_vm.$t("field.schedule.addEvent")) + " ")],
        ),
        _c(
          "k-draggable",
          {
            staticStyle: { "--columns": "12", gap: "0.5rem" },
            attrs: {
              list: _vm.items,
              options: _vm.sourceOptions,
              element: "k-grid",
            },
          },
          _vm._l(_vm.items, function (item) {
            return _c(
              "li",
              {
                key: item.id,
                staticClass: "list-item",
                style: { backgroundColor: item.color },
                on: {
                  dblclick: function ($event) {
                    return _vm.editItem(item, item.id);
                  },
                },
              },
              [
                _c(
                  "div",
                  {
                    staticClass: "list-item-content",
                    style: { color: item.color },
                  },
                  [
                    _c("span", { staticClass: "list-item-title" }, [
                      _vm._v(" " + _vm._s(item.title) + " "),
                    ]),
                    _c("k-options-dropdown", {
                      staticClass: "event-options-trigger",
                      attrs: {
                        options: _vm.itemOptions,
                        text: false,
                        icon: "dots",
                        size: "xs",
                      },
                      on: {
                        action: function ($event) {
                          return _vm.handleAction($event, item);
                        },
                      },
                    }),
                  ],
                  1,
                ),
              ],
            );
          }),
          0,
        ),
      ],
      1,
    );
  };
  var _sfc_staticRenderFns$1 = [];
  _sfc_render$1._withStripped = true;
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    _sfc_render$1,
    _sfc_staticRenderFns$1,
    false,
    null,
    null,
  );
  __component__$1.options.__file =
    "/home/jona-vdv/Documents/programming/projects/kirby-schedule-field/packages/kirby-schedule-field/src/components/create-item.vue";
  const CreateItem = __component__$1.exports;
  const _sfc_main = Vue.defineComponent({
    extends: "k-field",
    components: {
      ScheduleEventItem,
      ScheduleTable,
      CreateItem,
    },
    props: {
      value: {
        /**
         * @type {import('vue').PropType<Value>}
         */
        type: Object,
        default: () => ({
          items: [],
          events: [],
        }),
      },
      timeRangeStart: {
        type: Number,
        default: 8,
      },
      timeRangeEnd: {
        type: Number,
        default: 22,
      },
      create: {
        /**
         * @type {import('vue').PropType<createProps>}
         */
        type: [Object],
      },
      endpoints: Object,
    },
    data() {
      return {
        /**
         * @type {Value['items']}
         */
        items: [],
        /**
         * @type {Value['events']}
         * @description The events for the current week.
         */
        events: [],
        /**
         * @type {Value['recurringEvents']}
         * @description The recurring events, that are visible for a certain period of time.
         */
        recurringEvents: [],
        currentDay: this.$library.dayjs(),
        currentLocale: "en",
      };
    },
    provide() {
      return {
        allItems: Vue.computed(() => this.items),
        allEvents: Vue.computed(() => this.events),
        allRecurringEvents: Vue.computed(() => this.recurringEvents),
      };
    },
    beforeMount() {
      this.$library.dayjs.extend(weekOfYear);
      this.$library.dayjs.extend(advancedFormat);
      this.$library.dayjs.extend(isBetween);
      const localeCode = window.panel.translation.code;
      this.currentLocale = localeCode;
      if (window.panel.translation.code === "nl") {
        console.log("Setting locale to:", window.panel.translation.code);
        this.$library.dayjs.locale(LangNl);
        console.log(this.$library.dayjs.locale());
      } else {
        this.$library.dayjs.locale(window.panel.translation.code);
      }
    },
    computed: {
      startOfWeek() {
        return this.currentDay.startOf("week");
      },
      endOfWeek() {
        return this.currentDay.endOf("week");
      },
      displayWeeklabel() {
        return this.endOfWeek.format("YYYY-ww");
      },
    },
    watch: {
      value: {
        /**
         *
         * @param newValue {Value}
         */
        handler(newValue) {
          this.items = newValue.items || [];
          this.events = newValue.events || [];
          this.recurringEvents = newValue.recurringEvents || [];
          this.$emit("input", {
            items: newValue.items,
            events: newValue.events,
            recurringEvents: newValue.recurringEvents,
          });
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      /**
       *
       * @param data {import('./create-item.vue').Item}
       */
      saveItem(data) {
        console.log("Event data:", data.title);
        const id = this.$helper.string.uuid();
        data.id = id;
        this.items.push(data);
        console.log("Items after save:", this.items);
        this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
        });
      },
      /**
       *
       * @param data {import('./create-item.vue').Item}
       * @param id {string}
       */
      editItem(data, id) {
        console.log("Editing item with id:", id, "New values:", data);
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...data };
          this.$emit("input", {
            items: this.items,
            events: this.events,
            recurringEvents: this.recurringEvents,
          });
        }
      },
      goToToday() {
        this.currentDay = this.$library.dayjs();
      },
      form() {
        const fields = this.$helper.field.subfields(this, {
          lecturer: {
            type: "users",
            label: "Lecturer",
            multiple: false,
            required: true,
          },
        });
        console.log(fields);
        return fields;
      },
      /**
       *
       * @param eventData {import('./schedule-event-item.vue').Event}
       */
      createEvent(eventData) {
        this.events.push(eventData);
        this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
        });
      },
      /**
       * @param payload {Object}
       * @param payload.instanceId {string}
       * @param payload.newValues {Partial<import('./schedule-event-item.vue').Event>}
       */
      moveEvent({ instanceId, newValues }) {
        const index = this.events.findIndex(
          (event2) => event2.instanceId === instanceId,
        );
        if (index === -1) {
          console.error("Event not found for instanceId:", instanceId);
          return;
        }
        const event = this.events[index];
        const updatedEvent = {
          ...event,
          startTime: newValues.startTime,
          dayOfWeek: newValues.dayOfWeek,
          startDate: newValues.startDate,
        };
        this.events.splice(index, 1, updatedEvent);
        this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
        });
      },
      /**
       *
       * @param id {string}
       * @param newValues {import('./schedule-event-item.vue').Event}
       */
      editEvent(id, newValues) {
        console.log("Editing event with id:", id, "New values:", newValues);
        const index = this.events.findIndex((event) => event.instanceId === id);
        if (index !== -1) {
          const startTimeString = newValues.start;
          const endTimeString = newValues.end;
          const startDateTime = this.$library.dayjs(
            `2000-01-01 ${startTimeString}`,
          );
          const endDateTime = this.$library.dayjs(
            `2000-01-01 ${endTimeString}`,
          );
          const durationInMinutes = endDateTime.diff(startDateTime, "minute");
          const newDuration = ((durationInMinutes / 60) * 1e3) / 1e3;
          this.events[index] = {
            ...this.events[index],
            ...newValues,
            startTime: newValues.start,
            endTime: newValues.end,
            dayOfWeek: Number(newValues.day),
            duration: newDuration,
          };
          this.$emit("input", {
            items: this.items,
            events: this.events,
            recurringEvents: this.recurringEvents,
          });
        }
      },
      /**
       * @param item {Item}
       */
      deleteItem(item) {
        const id = item.id;
        openItemDeleteDialog(item, () => {
          this.items = this.items.filter((item2) => {
            return item2.id !== id;
          });
          this.events = this.events.filter((event) => {
            return event.itemId !== id;
          });
          this.$emit("input", {
            items: this.items,
            events: this.events,
            recurringEvents: this.recurringEvents,
          });
        });
      },
      /**
       *
       * @param instanceId {string}
       */
      deleteEvent(instanceId) {
        console.log("Deleting event with instanceId:", instanceId);
        this.events = this.events.filter((event) => {
          return event.instanceId !== instanceId;
        });
        this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
        });
      },
    },
  });
  var _sfc_render = function render() {
    var _vm = this,
      _c = _vm._self._c;
    return _c(
      "k-field",
      _vm._b({ staticClass: "k-schedule-field" }, "k-field", _vm.$props, false),
      [
        _c(
          "div",
          [
            _c("CreateItem", {
              attrs: {
                items: _vm.items,
                fields: _vm.create,
                endpoints: _vm.endpoints,
              },
              on: {
                "delete-items": _vm.deleteItem,
                "add-items": _vm.saveItem,
                "edit-items": _vm.editItem,
              },
            }),
          ],
          1,
        ),
        _c(
          "div",
          { staticClass: "schedule-navigation" },
          [
            _c(
              "div",
              { staticClass: "schedule-navigation-buttons" },
              [
                _c("k-button", {
                  attrs: {
                    icon: "angle-left",
                    variant: "filled",
                    theme: "blue",
                  },
                  on: {
                    click: function ($event) {
                      _vm.currentDay = _vm.currentDay.subtract(1, "week");
                    },
                  },
                }),
                _c("k-button", {
                  attrs: {
                    icon: "angle-right",
                    variant: "filled",
                    theme: "blue",
                  },
                  on: {
                    click: function ($event) {
                      _vm.currentDay = _vm.currentDay.add(1, "week");
                    },
                  },
                }),
              ],
              1,
            ),
            _c("span", { staticClass: "week-label" }, [
              _vm._v(" " + _vm._s(_vm.displayWeeklabel) + " "),
            ]),
            _c(
              "k-button",
              {
                attrs: { icon: "calendar", theme: "blue", variant: "filled" },
                on: { click: _vm.goToToday },
              },
              [_vm._v(" " + _vm._s(_vm.$t("field.schedule.goToToday")) + " ")],
            ),
          ],
          1,
        ),
        _c(
          "div",
          [
            _c("ScheduleTable", {
              attrs: {
                "current-locale": _vm.currentLocale,
                "time-range-start": _vm.timeRangeStart,
                "time-range-end": _vm.timeRangeEnd,
                "current-day": _vm.currentDay,
              },
              on: {
                "delete-event": _vm.deleteEvent,
                "create-event": _vm.createEvent,
                "edit-event": _vm.editEvent,
                "move-event": _vm.moveEvent,
              },
            }),
          ],
          1,
        ),
      ],
    );
  };
  var _sfc_staticRenderFns = [];
  _sfc_render._withStripped = true;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns,
    false,
    null,
    null,
  );
  __component__.options.__file =
    "/home/jona-vdv/Documents/programming/projects/kirby-schedule-field/packages/kirby-schedule-field/src/components/schedule-item-area.vue";
  const ScheduleItemArea = __component__.exports;
  window.panel.plugin("IMA/kirby-schedule-field", {
    fields: {
      schedule: ScheduleItemArea,
    },
  });
})();
