#!/usr/bin/env python3
"""
Temariware Senior Project — Diagram Generator
Generates ALL figures referenced in the proposal document as PNG images.

Output: /home/z/my-project/download/figures/figure_XX_*.png
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle, Circle, Ellipse
import graphviz
import textwrap

FIG_DIR = "/home/z/my-project/download/figures"
os.makedirs(FIG_DIR, exist_ok=True)

# Consistent palette — black-on-white per the project guideline (white background, black text)
COL_PRIMARY = "#000000"
COL_BG = "#FFFFFF"
COL_BOX_FILL = "#F5F5F5"
COL_BORDER = "#000000"
COL_ACCENT = "#1F4E79"  # minimal use, only for actor labels

# Use a serif font to match the document's Times New Roman aesthetic
plt.rcParams["font.family"] = "DejaVu Serif"
plt.rcParams["font.size"] = 10

# ----------------------------------------------------------------------------
# Helper: matplotlib figure setup
# ----------------------------------------------------------------------------

def new_fig(width=10, height=7):
    fig, ax = plt.subplots(figsize=(width, height), dpi=150)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.set_aspect("equal")
    ax.axis("off")
    fig.patch.set_facecolor(COL_BG)
    return fig, ax

def box(ax, x, y, w, h, text, fill=COL_BOX_FILL, fontsize=10, bold=False, align="center"):
    rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.5",
                          linewidth=1.2, edgecolor=COL_BORDER, facecolor=fill)
    ax.add_patch(rect)
    weight = "bold" if bold else "normal"
    if align == "center":
        ax.text(x + w/2, y + h/2, text, ha="center", va="center",
                fontsize=fontsize, weight=weight, wrap=True, color=COL_PRIMARY)
    elif align == "left":
        ax.text(x + 0.5, y + h/2, text, ha="left", va="center",
                fontsize=fontsize, weight=weight, wrap=True, color=COL_PRIMARY)
    return rect

def ellipse(ax, x, y, w, h, text, fill="#FFE4B5", fontsize=9):
    e = Ellipse((x + w/2, y + h/2), w, h, linewidth=1.2, edgecolor=COL_BORDER, facecolor=fill)
    ax.add_patch(e)
    ax.text(x + w/2, y + h/2, text, ha="center", va="center", fontsize=fontsize, color=COL_PRIMARY)

def arrow(ax, x1, y1, x2, y2, label="", style="->", color=COL_PRIMARY, fontsize=8, dashed=False):
    linestyle = "--" if dashed else "-"
    ar = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=14,
                         linewidth=1.0, color=color, linestyle=linestyle)
    ax.add_patch(ar)
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx, my+1.5, label, ha="center", va="bottom", fontsize=fontsize, color=color,
                bbox=dict(boxstyle="round,pad=0.2", fc="white", ec="none"))

def save(fig, name):
    path = os.path.join(FIG_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=COL_BG)
    plt.close(fig)
    print(f"  ✓ {name}")
    return path

# ============================================================================
# FIGURE 2.1 — Essential Use Case Diagram
# ============================================================================

def fig_2_1_use_case():
    fig, ax = new_fig(12, 8)
    ax.set_title("Figure 2.1: Essential Use Case Diagram of Temariware", fontsize=13, weight="bold", pad=20)

    # System boundary
    sys_rect = Rectangle((20, 5), 60, 90, linewidth=1.5, edgecolor=COL_BORDER, facecolor="#FAFAFA")
    ax.add_patch(sys_rect)
    ax.text(50, 96, "Temariware System", ha="center", fontsize=11, weight="bold")

    # Actors (left + right)
    # Student (left)
    ax.text(8, 75, "👤", ha="center", fontsize=22)
    ax.text(8, 70, "Student", ha="center", fontsize=10, weight="bold", color=COL_ACCENT)
    # Employer (left, lower)
    ax.text(8, 45, "👤", ha="center", fontsize=22)
    ax.text(8, 40, "Employer", ha="center", fontsize=10, weight="bold", color=COL_ACCENT)
    # Admin (right)
    ax.text(92, 75, "👤", ha="center", fontsize=22)
    ax.text(92, 70, "Admin", ha="center", fontsize=10, weight="bold", color=COL_ACCENT)
    # Bot (right, lower)
    ax.text(92, 45, "🤖", ha="center", fontsize=22)
    ax.text(92, 40, "Telegram Bot", ha="center", fontsize=10, weight="bold", color=COL_ACCENT)

    # Use cases (ellipses) — 8 essential ones
    use_cases = [
        (35, 88, "Browse Job Feed"),
        (65, 88, "View Job Detail"),
        (35, 78, "Apply to Job"),
        (65, 78, "Subscribe to Alerts"),
        (35, 68, "Complete Profile"),
        (65, 68, "Upload Payment"),
        (35, 58, "Post Job"),
        (65, 58, "Review Applicants"),
        (35, 48, "Accept Applicant"),
        (65, 48, "Approve Job"),
        (35, 38, "Approve Payment"),
        (65, 38, "Configure Settings"),
        (35, 28, "Verify Employer"),
        (65, 28, "Broadcast to Channel"),
        (50, 18, "Handle Slash Commands"),
    ]
    for x, y, label in use_cases:
        ellipse(ax, x-9, y-3, 18, 6, label, fill="#FFF8DC", fontsize=8)

    # Actor-to-UC connections (Student)
    for uc_x, uc_y in [(35, 88), (65, 88), (35, 78), (65, 78), (35, 68), (65, 68), (35, 38)]:
        arrow(ax, 10, 71, uc_x-9, uc_y, style="-", color="#666666")

    # Employer
    for uc_x, uc_y in [(35, 58), (65, 58), (35, 48), (65, 48), (35, 28)]:
        arrow(ax, 10, 41, uc_x-9, uc_y, style="-", color="#666666")

    # Admin
    for uc_x, uc_y in [(65, 48), (35, 38), (65, 38), (65, 28)]:
        arrow(ax, 90, 71, uc_x+9, uc_y, style="-", color="#666666")

    # Bot
    for uc_x, uc_y in [(65, 28), (50, 18)]:
        arrow(ax, 90, 41, uc_x+9 if uc_x != 50 else 59, uc_y, style="-", color="#666666")

    save(fig, "figure_2_1_use_case.png")

# ============================================================================
# FIGURE 2.2 / 2.8 — Conceptual Class Diagram (graphviz)
# ============================================================================

def fig_2_2_class_model():
    g = graphviz.Digraph("class_model", format="png")
    g.attr(rankdir="TB", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="box", style="filled,rounded", fillcolor="#F5F5F5",
           color="black", fontname="DejaVu Serif", fontsize="11")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="10")

    # Classes
    g.node("User", "User\\n\\l- telegramId : String\\l- role : UserRole\\l- language : String\\l- verification : Enum\\l- profileComplete : Boolean\\l\\l+ authenticate()\\l+ updateProfile()\\l")
    g.node("Job", "Job\\n\\l- title : String\\l- subjects : String\\l- location : String\\l- salary : String\\l- status : JobStatus\\l- positionsAvailable : Int\\l- filledPositions : Int\\l- applicationFee : Float\\l\\l+ create()\\l+ approve()\\l+ close()\\l")
    g.node("Application", "Application\\n\\l- message : String\\l- status : ApplicationStatus\\l- paymentScreenshot : String\\l- hiredAt : DateTime\\l\\l+ accept()\\l+ pay()\\l+ hire()\\l")
    g.node("Subscription", "Subscription\\n\\l- category : String\\l\\l+ match()\\l")
    g.node("VerificationRequest", "VerificationRequest\\n\\l- companyName : String\\l- contactTelegram : String\\l- proofUrl : String\\l- status : VerificationStatus\\l\\l+ approve()\\l+ reject()\\l")
    g.node("Setting", "Setting\\n\\l- jobPostFee : Float\\l- applicationFee : Float\\l- paymentInstructions : String\\l\\l+ update()\\l", fillcolor="#FFE4B5")
    g.node("Payment", "Payment\\n\\l- type : PaymentType\\l- amount : Float\\l- screenshotUrl : String\\l- status : PaymentStatus\\l\\l+ approve()\\l+ reject()\\l")

    # Relationships
    g.edge("User", "Job", label="1  *  (employer)", arrowhead="none", arrowtail="none", dir="both")
    g.edge("User", "Application", label="1  *  (student)", arrowhead="none", arrowtail="none", dir="both")
    g.edge("Job", "Application", label="1  *", arrowhead="none", arrowtail="none", dir="both")
    g.edge("User", "Subscription", label="1  *", arrowhead="none", arrowtail="none", dir="both")
    g.edge("User", "VerificationRequest", label="1  0..1", arrowhead="none", arrowtail="none", dir="both")
    g.edge("User", "Payment", label="1  *", arrowhead="none", arrowtail="none", dir="both")
    g.edge("Job", "Payment", label="1  *", arrowhead="none", arrowtail="none", dir="both")
    g.edge("Application", "Payment", label="0..1  0..1", arrowhead="none", arrowtail="none", dir="both", style="dashed")

    path = os.path.join(FIG_DIR, "figure_2_2_class_model.png")
    g.render(filename="figure_2_2_class_model", directory=FIG_DIR, cleanup=True, format="png")
    # graphviz appends .png, render saves as path.png
    print(f"  ✓ figure_2_2_class_model.png")

# ============================================================================
# FIGURE 2.3 / 2.9 — Sequence Diagram: Apply to Job
# ============================================================================

def fig_2_3_sequence_apply():
    fig, ax = new_fig(11, 8)
    ax.set_title("Figure 2.3: Sequence Diagram — Apply to Job", fontsize=13, weight="bold", pad=20)

    actors = ["Student\n(MiniApp)", "Jobs API", "Applications\nAPI", "Database", "Employer\n(notify)"]
    xs = [10, 30, 50, 70, 90]
    top_y, bot_y = 90, 8

    # Actor boxes (top + bottom)
    for x, name in zip(xs, actors):
        box(ax, x-7, top_y, 14, 5, name, fill="#E8E8E8", fontsize=9, bold=True)
        box(ax, x-7, bot_y-2, 14, 5, name, fill="#E8E8E8", fontsize=9, bold=True)
        # Lifelines
        ax.plot([x, x], [bot_y+3, top_y], color="black", linestyle="--", linewidth=0.8)

    # Messages
    msgs = [
        (xs[0], xs[1], 86, "1. GET /api/jobs/{id}", "->"),
        (xs[1], xs[3], 80, "2. findUnique(jobId)", "->"),
        (xs[3], xs[1], 74, "3. Job {title, subjects, ...}", "<-"),
        (xs[1], xs[0], 68, "4. Job detail JSON", "<-"),
        (xs[0], xs[2], 60, "5. POST /api/jobs/{id}/apply", "->"),
        (xs[2], xs[3], 54, "6. check profile complete", "->"),
        (xs[3], xs[2], 48, "7. ok / not ok", "<-"),
        (xs[2], xs[3], 42, "8. create application", "->"),
        (xs[3], xs[2], 36, "9. application record", "<-"),
        (xs[2], xs[0], 30, "10. { success, applicationId }", "<-"),
        (xs[2], xs[4], 22, "11. sendMessage(employer, applicant profile)", "->"),
        (xs[4], xs[4], 16, "12. notification received", "->"),
    ]
    for x1, x2, y, label, style in msgs:
        color = "#666666" if style == "<-" else COL_PRIMARY
        arrow(ax, x1, y, x2, y, label=label, style=style, color=color, fontsize=8)

    save(fig, "figure_2_3_sequence_apply.png")

# ============================================================================
# FIGURE 2.4 / 2.12 — Activity Diagram: Job Posting & Approval Flow
# ============================================================================

def fig_2_4_activity_job_flow():
    fig, ax = new_fig(8, 11)
    ax.set_title("Figure 2.4: Activity Diagram — Job Posting & Approval Flow", fontsize=13, weight="bold", pad=20)

    # Start node (filled circle)
    start = Circle((50, 96), 1.5, color=COL_PRIMARY)
    ax.add_patch(start)

    # Activities (rounded rectangles)
    activities = [
        (40, 88, "Employer submits job form\n+ payment screenshot"),
        (40, 78, "Job saved as PENDING_PAYMENT"),
        (40, 68, "Admin reviews content\n+ payment screenshot"),
        (40, 56, "Approve?"),
        (40, 44, "Job status → APPROVED\nPayment status → APPROVED"),
        (40, 34, "Broadcast to @TEMARIWARE\nchannel"),
        (40, 24, "Push alerts to subscribers"),
        (40, 14, "Employer notified"),
    ]
    for x, y, label in activities:
        if "?" in label:
            # Decision diamond
            diamond = mpatches.Polygon([(x+10, y+5), (x+20, y), (x+10, y-5), (x, y)],
                                        closed=True, edgecolor=COL_BORDER, facecolor="#FFF8DC", linewidth=1.2)
            ax.add_patch(diamond)
            ax.text(x+10, y, label, ha="center", va="center", fontsize=9, weight="bold")
        else:
            box(ax, x, y-4, 20, 8, label, fill=COL_BOX_FILL, fontsize=9)

    # Yes / No paths
    # No (reject)
    box(ax, 65, 53, 22, 6, "Job status → REJECTED\nEmployer notified", fill="#FFE4E1", fontsize=9)
    arrow(ax, 60, 56, 65, 56, label="No", style="->")
    arrow(ax, 76, 53, 76, 14, style="->", dashed=True)
    # End of No
    end_circle_2 = Circle((76, 12), 1.5, color=COL_PRIMARY, fill=False, linewidth=1.5)
    ax.add_patch(end_circle_2)
    inner_2 = Circle((76, 12), 0.8, color=COL_PRIMARY)
    ax.add_patch(inner_2)

    # Yes path
    arrow(ax, 50, 50, 50, 48, label="Yes", style="->")

    # Connect vertical arrows
    coords = [(50, 95), (50, 92), (50, 82), (50, 72), (50, 60), (50, 52), (50, 40), (50, 30), (50, 20), (50, 14)]
    for i in range(len(coords)-1):
        arrow(ax, coords[i][0], coords[i][1]-1, coords[i+1][0], coords[i+1][1]+1, style="->")

    # End node
    end_circle = Circle((50, 10), 1.5, color=COL_PRIMARY, fill=False, linewidth=1.5)
    ax.add_patch(end_circle)
    inner = Circle((50, 10), 0.8, color=COL_PRIMARY)
    ax.add_patch(inner)

    save(fig, "figure_2_4_activity_job_flow.png")

# ============================================================================
# FIGURE 2.5 — UI Prototype (Home View wireframe)
# ============================================================================

def fig_2_5_ui_home():
    fig, ax = new_fig(7, 12)
    ax.set_title("Figure 2.5: Essential UI Prototype — Home View", fontsize=13, weight="bold", pad=20)

    # Phone frame
    phone = FancyBboxPatch((10, 5), 80, 90, boxstyle="round,pad=0.5,rounding_size=2",
                            linewidth=2, edgecolor=COL_BORDER, facecolor="#FAFAFA")
    ax.add_patch(phone)

    # Top bar
    box(ax, 12, 90, 76, 5, "Temariware  |  🌐 EN", fill="#E8E8E8", fontsize=10, bold=True)
    # Search bar
    box(ax, 14, 84, 72, 4, "🔍  Search jobs...", fill="white", fontsize=9, align="left")
    # Filter chips
    box(ax, 14, 78, 15, 3, "Filter", fill="#E8E8E8", fontsize=8)
    box(ax, 30, 78, 18, 3, "Math", fill="#E8E8E8", fontsize=8)
    box(ax, 49, 78, 18, 3, "Harar", fill="#E8E8E8", fontsize=8)

    # Job cards
    jobs = [
        (14, 70, "Math Tutor — Grade 8", "Harar | 4 days/week", "3000 ETB"),
        (14, 60, "English Tutor — Grade 5", "Aweday | Weekends", "Negotiable"),
        (14, 50, "Graphic Designer (Freelance)", "Remote | ~10h/wk", "1500-3500 ETB"),
        (14, 40, "Chemistry Tutor — Grade 12", "Near Harar Univ", "2000 ETB/mo"),
        (14, 30, "Sales Representative", "Addis Ababa | Hybrid", "Monthly+comm"),
    ]
    for x, y, title, sub, salary in jobs:
        box(ax, x, y-3, 72, 8, "", fill="white", fontsize=8)
        ax.text(x+1, y+3, title, fontsize=9, weight="bold", ha="left")
        ax.text(x+1, y, sub, fontsize=8, color="#666666", ha="left")
        ax.text(x+1, y-2, salary, fontsize=8, color=COL_PRIMARY, ha="left")

    # Bottom nav
    box(ax, 12, 8, 76, 5, "🏠 Jobs   ➕ Post   📥 Apps   👤 Profile", fill="#E8E8E8", fontsize=9, bold=True)

    save(fig, "figure_2_5_ui_home.png")

# ============================================================================
# FIGURE 2.6 — UI Flow Diagram
# ============================================================================

def fig_2_6_ui_flow():
    g = graphviz.Digraph("ui_flow", format="png")
    g.attr(rankdir="LR", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="box", style="filled,rounded", fillcolor="#F5F5F5",
           color="black", fontname="DejaVu Serif", fontsize="11", width="1.6", height="0.8")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="9")

    g.node("home", "Home\n(Job Feed)")
    g.node("detail", "Job Detail")
    g.node("post", "Post Job")
    g.node("apps", "Applications")
    g.node("profile", "Profile")
    g.node("admin", "Admin")

    g.edge("home", "detail", label="tap job card")
    g.edge("detail", "home", label="back")
    g.edge("home", "post", label="nav")
    g.edge("post", "home", label="submitted")
    g.edge("home", "apps", label="nav")
    g.edge("home", "profile", label="nav")
    g.edge("home", "admin", label="nav (admin only)", style="dashed")
    g.edge("profile", "admin", label="verify → admin", style="dashed")

    g.render(filename="figure_2_6_ui_flow", directory=FIG_DIR, cleanup=True, format="png")
    print(f"  ✓ figure_2_6_ui_flow.png")

# ============================================================================
# FIGURE 2.10 — Sequence: Accept & Pay
# ============================================================================

def fig_2_10_sequence_accept_pay():
    fig, ax = new_fig(12, 8)
    ax.set_title("Figure 2.10: Sequence Diagram — Accept Applicant and Pay", fontsize=13, weight="bold", pad=20)

    actors = ["Employer\n(MiniApp)", "Accept API", "Student\n(notify)", "Pay API", "Admin"]
    xs = [10, 28, 46, 64, 86]
    top_y, bot_y = 90, 8
    for x, name in zip(xs, actors):
        box(ax, x-7, top_y, 14, 5, name, fill="#E8E8E8", fontsize=9, bold=True)
        box(ax, x-7, bot_y-2, 14, 5, name, fill="#E8E8E8", fontsize=9, bold=True)
        ax.plot([x, x], [bot_y+3, top_y], color="black", linestyle="--", linewidth=0.8)

    msgs = [
        (xs[0], xs[1], 85, "1. POST /applications/{id}/accept", "->"),
        (xs[1], xs[3], 79, "2. update status=ACCEPTED", "->"),
        (xs[1], xs[2], 73, "3. sendMessage(student, pay X ETB)", "->"),
        (xs[2], xs[3], 65, "4. POST /applications/{id}/pay (screenshot)", "->"),
        (xs[3], xs[4], 58, "5. status=PAYMENT_PENDING, notify admin", "->"),
        (xs[4], xs[3], 51, "6. POST /admin/applications/{id} (approve)", "<-"),
        (xs[3], xs[3], 44, "7. status=HIRED, hiredAt=now", "->"),
        (xs[3], xs[3], 38, "8. job.filledPositions++", "->"),
        (xs[3], xs[2], 31, "9. sendMessage(student, hired)", "->"),
        (xs[3], xs[0], 24, "10. sendMessage(employer, hired)", "->"),
    ]
    for x1, x2, y, label, style in msgs:
        color = "#666666" if style == "<-" else COL_PRIMARY
        arrow(ax, x1, y, x2, y, label=label, style=style, color=color, fontsize=8)

    save(fig, "figure_2_10_sequence_accept_pay.png")

# ============================================================================
# FIGURE 2.11 — Sequence: Approve & Broadcast
# ============================================================================

def fig_2_11_sequence_approve_broadcast():
    fig, ax = new_fig(12, 8)
    ax.set_title("Figure 2.11: Sequence Diagram — Approve Job and Broadcast", fontsize=13, weight="bold", pad=20)

    actors = ["Admin\n(MiniApp)", "Admin API", "Database", "Channel\n(Telegram)", "Subscribers"]
    xs = [10, 30, 50, 70, 90]
    top_y, bot_y = 90, 8
    for x, name in zip(xs, actors):
        box(ax, x-7, top_y, 14, 5, name, fill="#E8E8E8", fontsize=9, bold=True)
        box(ax, x-7, bot_y-2, 14, 5, name, fill="#E8E8E8", fontsize=9, bold=True)
        ax.plot([x, x], [bot_y+3, top_y], color="black", linestyle="--", linewidth=0.8)

    msgs = [
        (xs[0], xs[1], 85, "1. POST /admin/jobs/{id} (approve)", "->"),
        (xs[1], xs[2], 79, "2. job.status=APPROVED, payment.status=APPROVED", "->"),
        (xs[1], xs[3], 71, "3. sendMessage(channel, jobCard)", "->"),
        (xs[3], xs[4], 64, "4. push alert (matching subs)", "->"),
        (xs[1], xs[2], 56, "5. query subscribers (category=jobType)", "->"),
        (xs[2], xs[1], 50, "6. subscribers[]", "<-"),
        (xs[1], xs[4], 42, "7. sendMessage(each subscriber)", "->"),
        (xs[1], xs[0], 32, "8. { ok, broadcastCount, channelPosted }", "<-"),
    ]
    for x1, x2, y, label, style in msgs:
        color = "#666666" if style == "<-" else COL_PRIMARY
        arrow(ax, x1, y, x2, y, label=label, style=style, color=color, fontsize=8)

    save(fig, "figure_2_11_sequence_approve_broadcast.png")

# ============================================================================
# FIGURE 2.13 — Activity: Application Lifecycle
# ============================================================================

def fig_2_13_activity_app_lifecycle():
    g = graphviz.Digraph("app_lifecycle", format="png")
    g.attr(rankdir="TB", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="box", style="filled,rounded", fillcolor="#F5F5F5",
           color="black", fontname="DejaVu Serif", fontsize="11")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="10")

    # Initial state
    g.node("start", shape="circle", style="filled", fillcolor="black", width="0.3", label="")
    g.node("pending", "PENDING\n(student applied)")
    g.node("accepted", "ACCEPTED\n(employer accepted)")
    g.node("pay_pending", "PAYMENT_PENDING\n(student uploaded screenshot)")
    g.node("hired", "HIRED", fillcolor="#D4EDDA")
    g.node("rejected", "REJECTED", fillcolor="#F8D7DA")
    g.node("closed", "CLOSED\n(job auto-closed)", fillcolor="#FFF3CD")

    # Decision: employer reviews
    g.node("employer_dec", shape="diamond", style="filled", fillcolor="#FFF8DC", label="Employer\nreview", fontsize="10")
    # Decision: admin reviews payment
    g.node("admin_dec", shape="diamond", style="filled", fillcolor="#FFF8DC", label="Admin\nreview", fontsize="10")
    # Decision: positions filled?
    g.node("positions_dec", shape="diamond", style="filled", fillcolor="#FFF8DC", label="Positions\nfilled?", fontsize="10")

    g.edge("start", "pending")
    g.edge("pending", "employer_dec")
    g.edge("employer_dec", "accepted", label="accept")
    g.edge("employer_dec", "rejected", label="reject")
    g.edge("accepted", "pay_pending", label="student uploads\nscreenshot")
    g.edge("pay_pending", "admin_dec")
    g.edge("admin_dec", "hired", label="approve")
    g.edge("admin_dec", "accepted", label="reject\n(re-upload)", style="dashed")
    g.edge("hired", "positions_dec")
    g.edge("positions_dec", "closed", label="yes (auto-close)")
    g.edge("positions_dec", "closed", label="no (job still open)", style="dashed")
    g.edge("closed", "end", label="notify all")
    g.edge("rejected", "end")

    g.node("end", shape="doublecircle", style="filled", fillcolor="white", width="0.3", label="")

    g.render(filename="figure_2_13_activity_app_lifecycle", directory=FIG_DIR, cleanup=True, format="png")
    print(f"  ✓ figure_2_13_activity_app_lifecycle.png")

# ============================================================================
# FIGURE 3.1 — Class Type Architecture (Entity-Boundary-Control)
# ============================================================================

def fig_3_1_class_type():
    fig, ax = new_fig(13, 9)
    ax.set_title("Figure 3.1: Class Type Architecture (Entity-Boundary-Control)", fontsize=13, weight="bold", pad=20)

    # 3 columns: Boundary, Control, Entity
    ax.text(20, 95, "BOUNDARY CLASSES", ha="center", fontsize=11, weight="bold", color=COL_ACCENT)
    ax.text(50, 95, "CONTROL CLASSES", ha="center", fontsize=11, weight="bold", color=COL_ACCENT)
    ax.text(80, 95, "ENTITY CLASSES", ha="center", fontsize=11, weight="bold", color=COL_ACCENT)

    boundaries = ["HomeView", "JobDetailView", "PostJobView", "ApplicationsView", "ProfileView", "AdminView", "BotWebhookHandler"]
    controls = ["AuthController", "JobController", "ApplicationController", "PaymentController", "AdminController", "BotController"]
    entities = ["User", "Job", "Application", "Subscription", "VerificationRequest", "Setting", "Payment"]

    for i, b in enumerate(boundaries):
        y = 85 - i*7
        box(ax, 10, y, 20, 5, b, fill="#E1F5FE", fontsize=9)
    for i, c in enumerate(controls):
        y = 85 - i*8
        box(ax, 40, y, 20, 5, c, fill="#FFF8E1", fontsize=9)
    for i, e in enumerate(entities):
        y = 85 - i*7
        box(ax, 70, y, 20, 5, e, fill="#E8F5E9", fontsize=9)

    # Arrows: boundaries → controls → entities
    for i in range(5):
        arrow(ax, 30, 87-i*7+2, 40, 85-i*8+2, style="-", color="#999999")
    for i in range(5):
        arrow(ax, 60, 85-i*8+2, 70, 87-i*7+2, style="-", color="#999999")

    save(fig, "figure_3_1_class_type.png")

# ============================================================================
# FIGURE 3.2 — Component Diagram (graphviz)
# ============================================================================

def fig_3_2_component():
    g = graphviz.Digraph("component", format="png")
    g.attr(rankdir="LR", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="component", style="filled", fillcolor="#F5F5F5",
           color="black", fontname="DejaVu Serif", fontsize="11")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="10")

    g.node("miniapp", "Next.js Mini App\n(Vercel)")
    g.node("bot", "Telegram Bot Webhook\n(API route)")
    g.node("db", "PostgreSQL\nDatabase (Neon)")
    g.node("tgapi", "Telegram Bot API\n(external)", fillcolor="#FFE4B5")
    g.node("channel", "@TEMARIWARE Channel\n(external)", fillcolor="#FFE4B5")

    g.edge("miniapp", "db", label="Prisma ORM")
    g.edge("miniapp", "tgapi", label="initData\nvalidation")
    g.edge("bot", "db")
    g.edge("bot", "tgapi", label="sendMessage")
    g.edge("tgapi", "bot", label="webhook updates", style="dashed")
    g.edge("bot", "channel", label="broadcast")

    g.render(filename="figure_3_2_component", directory=FIG_DIR, cleanup=True, format="png")
    print(f"  ✓ figure_3_2_component.png")

# ============================================================================
# FIGURE 3.3 — Deployment Diagram (graphviz)
# ============================================================================

def fig_3_3_deployment():
    g = graphviz.Digraph("deployment", format="png")
    g.attr(rankdir="LR", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="box3d", style="filled", fillcolor="#E8E8E8",
           color="black", fontname="DejaVu Serif", fontsize="11")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="10")

    g.node("vercel", "Vercel Edge Network\n(global serverless)")
    g.node("neon", "Neon Cloud\n(Frankfurt, eu-central-1)")
    g.node("telegram", "Telegram Cloud\n(Bot API + Channel)")
    g.node("user", "End User Devices\n(Telegram client)", shape="box", fillcolor="#FFE4B5")

    g.edge("user", "telegram", label="Telegram client")
    g.edge("telegram", "vercel", label="HTTPS webhook")
    g.edge("vercel", "neon", label="PostgreSQL\n(TCP)")
    g.edge("vercel", "telegram", label="HTTPS (sendMessage)", style="dashed")

    g.render(filename="figure_3_3_deployment", directory=FIG_DIR, cleanup=True, format="png")
    print(f"  ✓ figure_3_3_deployment.png")

# ============================================================================
# FIGURE 3.4 — Persistent Diagram (ER)
# ============================================================================

def fig_3_4_persistent():
    g = graphviz.Digraph("er", format="png")
    g.attr(rankdir="LR", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="record", style="filled", fillcolor="#F5F5F5",
           color="black", fontname="DejaVu Serif", fontsize="10")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="9", arrowhead="none")

    # Entities with attributes
    g.node("User", "{User\\l|id : cuid PK\\ltelegramId : string UK\\lusername : string\\lrole : enum\\llanguage : string\\lverification : enum\\lisAdmin : boolean\\lprofileComplete : boolean\\lnationalIdNumber : string\\lnationalIdImage : string\\luniversityIdNumber : string\\luniversityIdImage : string\\llastSemesterGradeImage : string\\l}", fillcolor="#E1F5FE")
    g.node("Job", "{Job\\l|id : cuid PK\\ltitle : string\\ldescription : string\\lsubjects : string\\llocation : string\\lworkType : enum\\lsalary : string\\lpositionsAvailable : int\\lfilledPositions : int\\lapplicationFee : float\\lstatus : enum\\lpaymentScreenshot : string\\lpaymentStatus : enum\\lemployerId : FK\\l}", fillcolor="#FFF8E1")
    g.node("Application", "{Application\\l|id : cuid PK\\ljobId : FK\\luserId : FK\\lmessage : string\\lstatus : enum\\lpaymentScreenshot : string\\lpaymentStatus : enum\\lhiredAt : datetime\\l\\lUK (jobId, userId)\\l}", fillcolor="#E8F5E9")
    g.node("Subscription", "{Subscription\\l|id : cuid PK\\luserId : FK\\lcategory : string\\l\\lUK (userId, category)\\l}")
    g.node("Verification", "{VerificationRequest\\l|id : cuid PK\\luserId : FK\\lcompanyName : string\\lcontactTelegram : string\\lproofUrl : string\\lstatus : enum\\l}")
    g.node("Setting", "{Setting\\l|id : 'singleton' PK\\ljobPostFee : float\\lapplicationFee : float\\lpaymentInstructions : string\\ltelebirrNumber : string\\lcbeAccount : string\\lchapaEnabled : boolean\\l}", fillcolor="#FFE4B5")
    g.node("Payment", "{Payment\\l|id : cuid PK\\luserId : FK\\ljobId : FK\\lapplicationId : FK\\ltype : enum\\lamount : float\\lscreenshotUrl : string\\lstatus : enum\\lreviewedBy : string\\l}", fillcolor="#F3E5F5")

    # Relationships with cardinality
    g.edge("User", "Job", label="1    *  (employer)", arrowtail="tee", arrowhead="crow")
    g.edge("User", "Application", label="1    *  (student)", arrowtail="tee", arrowhead="crow")
    g.edge("Job", "Application", label="1    *", arrowtail="tee", arrowhead="crow")
    g.edge("User", "Subscription", label="1    *", arrowtail="tee", arrowhead="crow")
    g.edge("User", "Verification", label="1    0..1", arrowtail="tee", arrowhead="teeodot")
    g.edge("User", "Payment", label="1    *", arrowtail="tee", arrowhead="crow")
    g.edge("Job", "Payment", label="1    *", arrowtail="tee", arrowhead="crow")

    g.render(filename="figure_3_4_persistent", directory=FIG_DIR, cleanup=True, format="png")
    print(f"  ✓ figure_3_4_persistent.png")

# ============================================================================
# FIGURE 3.5 — Design-Level Class Diagram (refined with operations)
# ============================================================================

def fig_3_5_design_class():
    g = graphviz.Digraph("design_class", format="png")
    g.attr(rankdir="TB", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="record", style="filled", fillcolor="#F5F5F5",
           color="black", fontname="DejaVu Serif", fontsize="10")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="9", arrowhead="none")

    g.node("User", "{User\\l|- id : cuid\\l|- telegramId : string\\l|- role : UserRole\\l|- verification : VerificationStatus\\l|- profileComplete : boolean\\l|- isAdmin : boolean\\l|- nationalId* : string\\l|- universityId* : string\\l|- gradeReport* : string\\l|+ authenticate(initData) : User\\l+ upsertUser(tg) : User\\l+ updateProfile(data) : User\\l+ isAdminTelegramId(id) : boolean\\l}")
    g.node("Job", "{Job\\l|- id : cuid\\l|- title : string\\l|- subjects : string\\l|- location : string\\l|- workType : JobType\\l|- salary : string\\l|- positionsAvailable : int\\l|- filledPositions : int\\l|- applicationFee : float\\l|- status : JobStatus\\l|- paymentScreenshot : string\\l|- paymentStatus : PaymentStatus\\l|+ create(employerId, data) : Job\\l+ list(filters) : Job[]\\l+ approve(adminId) : void\\l+ close() : void\\l+ isFull() : boolean\\l}")
    g.node("Application", "{Application\\l|- id : cuid\\l|- jobId : cuid\\l|- userId : cuid\\l|- message : string\\l|- status : ApplicationStatus\\l|- paymentScreenshot : string\\l|- paymentStatus : PaymentStatus\\l|- hiredAt : datetime\\l|+ apply(userId, jobId, msg) : Application\\l+ accept(employerId) : void\\l+ pay(userId, screenshot) : void\\l+ hire(adminId) : void\\l+ isHired() : boolean\\l}")
    g.node("Payment", "{Payment\\l|- id : cuid\\l|- userId : cuid\\l|- jobId : cuid\\l|- applicationId : cuid\\l|- type : PaymentType\\l|- amount : float\\l|- screenshotUrl : string\\l|- status : PaymentStatus\\l|- reviewedBy : cuid\\l|+ create(data) : Payment\\l+ approve(adminId) : void\\l+ reject(adminId, reason) : void\\l}")
    g.node("Setting", "{Setting\\l|- id : 'singleton'\\l|- jobPostFee : float\\l|- applicationFee : float\\l|- paymentInstructions : string\\l|- telebirrNumber : string\\l|- chapaEnabled : boolean\\l|+ get() : Setting\\l+ update(adminId, data) : Setting\\l}", fillcolor="#FFE4B5")
    g.node("Subscription", "{Subscription\\l|- id : cuid\\l|- userId : cuid\\l|- category : string\\l|+ subscribe(userId, cat) : void\\l+ unsubscribe(userId, cat) : void\\l+ match(jobType) : User[]\\l}")
    g.node("Verification", "{VerificationRequest\\l|- id : cuid\\l|- userId : cuid\\l|- companyName : string\\l|- contactTelegram : string\\l|- proofUrl : string\\l|- status : VerificationStatus\\l|+ submit(userId, data) : void\\l+ approve(adminId) : void\\l+ reject(adminId, reason) : void\\l}")

    g.edge("User", "Job", label="1  *  employer", arrowtail="tee", arrowhead="crow")
    g.edge("User", "Application", label="1  *  applicant", arrowtail="tee", arrowhead="crow")
    g.edge("Job", "Application", label="1  *", arrowtail="tee", arrowhead="crow")
    g.edge("Application", "Payment", label="0..1  0..1", style="dashed")
    g.edge("User", "Subscription", label="1  *", arrowtail="tee", arrowhead="crow")
    g.edge("User", "Verification", label="1  0..1", arrowtail="tee", arrowhead="teeodot")

    g.render(filename="figure_3_5_design_class", directory=FIG_DIR, cleanup=True, format="png")
    print(f"  ✓ figure_3_5_design_class.png")

# ============================================================================
# FIGURE 3.6 — Collaboration Diagram: Apply to Job
# ============================================================================

def fig_3_6_collab_apply():
    fig, ax = new_fig(10, 8)
    ax.set_title("Figure 3.6: Collaboration Diagram — Apply to Job", fontsize=13, weight="bold", pad=20)

    # Objects
    objs = [
        (15, 70, ":MiniApp"),
        (50, 80, ":JobsAPI"),
        (50, 50, ":ApplicationsAPI"),
        (85, 65, ":Database"),
        (85, 30, ":EmployerNotify"),
    ]
    for x, y, name in objs:
        box(ax, x-9, y-3, 18, 6, name, fill="#E8E8E8", fontsize=10, bold=True)

    # Messages (numbered)
    arrows_data = [
        (15, 70, 50, 80, "1: GET /jobs/{id}"),
        (50, 80, 85, 65, "2: findUnique(jobId)"),
        (85, 65, 50, 80, "3: job data"),
        (50, 80, 15, 70, "4: job detail JSON"),
        (15, 70, 50, 50, "5: POST /apply"),
        (50, 50, 85, 65, "6: check profile"),
        (50, 50, 85, 65, "7: create application"),
        (50, 50, 85, 30, "8: sendMessage(employer)"),
    ]
    for x1, y1, x2, y2, label in arrows_data:
        arrow(ax, x1, y1-1, x2, y2+1, label=label, style="->", fontsize=8, dashed=False)

    save(fig, "figure_3_6_collab_apply.png")

# ============================================================================
# FIGURE 3.7 — Collaboration: Post Job and Pay
# ============================================================================

def fig_3_7_collab_post_pay():
    fig, ax = new_fig(10, 8)
    ax.set_title("Figure 3.7: Collaboration Diagram — Post Job and Pay", fontsize=13, weight="bold", pad=20)

    objs = [
        (15, 70, ":EmployerMiniApp"),
        (50, 80, ":JobsAPI"),
        (50, 50, ":PaymentModel"),
        (85, 65, ":Database"),
        (85, 30, ":AdminNotify"),
    ]
    for x, y, name in objs:
        box(ax, x-10, y-3, 20, 6, name, fill="#E8E8E8", fontsize=10, bold=True)

    arrows_data = [
        (15, 70, 50, 80, "1: POST /jobs (with screenshot)"),
        (50, 80, 50, 50, "2: create Payment audit"),
        (50, 80, 85, 65, "3: create Job (PENDING_PAYMENT)"),
        (50, 80, 85, 30, "4: notify admin (review)"),
        (85, 30, 15, 70, "5: notify employer (approved/rejected)"),
    ]
    for x1, y1, x2, y2, label in arrows_data:
        arrow(ax, x1, y1-1, x2, y2+1, label=label, style="->", fontsize=8)

    save(fig, "figure_3_7_collab_post_pay.png")

# ============================================================================
# FIGURE 3.8 — Collaboration: Approve Payment & Hire
# ============================================================================

def fig_3_8_collab_hire():
    fig, ax = new_fig(11, 8)
    ax.set_title("Figure 3.8: Collaboration Diagram — Approve Payment and Hire", fontsize=13, weight="bold", pad=20)

    objs = [
        (12, 65, ":AdminMiniApp"),
        (35, 80, ":AdminAPI"),
        (60, 75, ":ApplicationModel"),
        (60, 45, ":JobModel"),
        (88, 70, ":SubscriberNotify"),
        (88, 30, ":AutoCloseTrigger"),
    ]
    for x, y, name in objs:
        box(ax, x-9, y-3, 18, 6, name, fill="#E8E8E8", fontsize=9, bold=True)

    arrows_data = [
        (12, 65, 35, 80, "1: POST /admin/applications/{id}"),
        (35, 80, 60, 75, "2: status=HIRED"),
        (60, 75, 60, 45, "3: filledPositions++"),
        (60, 45, 88, 30, "4: check positions"),
        (88, 30, 60, 45, "5: if full → close job"),
        (60, 75, 88, 70, "6: notify student + employer"),
    ]
    for x1, y1, x2, y2, label in arrows_data:
        arrow(ax, x1, y1-1, x2, y2+1, label=label, style="->", fontsize=8)

    save(fig, "figure_3_8_collab_hire.png")

# ============================================================================
# FIGURE 3.9 — State Chart: Application Lifecycle
# ============================================================================

def fig_3_9_state_chart():
    g = graphviz.Digraph("state_chart", format="png")
    g.attr(rankdir="LR", bgcolor="white", fontname="DejaVu Serif", dpi="150")
    g.attr("node", shape="box", style="rounded,filled", fillcolor="#F5F5F5",
           color="black", fontname="DejaVu Serif", fontsize="11")
    g.attr("edge", color="black", fontname="DejaVu Serif", fontsize="10")

    g.node("start", shape="circle", style="filled", fillcolor="black", width="0.3", label="")
    g.node("pending", "PENDING", fillcolor="#FFF8DC")
    g.node("accepted", "ACCEPTED", fillcolor="#E1F5FE")
    g.node("pay_pending", "PAYMENT_PENDING", fillcolor="#F3E5F5")
    g.node("hired", "HIRED", fillcolor="#D4EDDA")
    g.node("rejected", "REJECTED", fillcolor="#F8D7DA")
    g.node("closed", "CLOSED", fillcolor="#FFF3CD")
    g.node("end", shape="doublecircle", style="filled", fillcolor="white", width="0.3", label="")

    g.edge("start", "pending", label="student applies")
    g.edge("pending", "accepted", label="employer accepts")
    g.edge("pending", "rejected", label="employer rejects")
    g.edge("accepted", "pay_pending", label="student uploads\nscreenshot")
    g.edge("pay_pending", "hired", label="admin approves")
    g.edge("pay_pending", "accepted", label="admin rejects\n(re-upload)", style="dashed")
    g.edge("hired", "closed", label="positions filled\n(auto-close)")
    g.edge("hired", "end")
    g.edge("rejected", "end")
    g.edge("closed", "end", label="notify all")

    g.render(filename="figure_3_9_state_chart", directory=FIG_DIR, cleanup=True, format="png")
    print(f"  ✓ figure_3_9_state_chart.png")

# ============================================================================
# FIGURE 3.10–3.15 — UI Diagrams (Home, Job Detail, Post Job, Applications, Profile, Admin)
# ============================================================================

def draw_phone_frame(ax, title):
    phone = FancyBboxPatch((5, 5), 90, 90, boxstyle="round,pad=0.5,rounding_size=2",
                            linewidth=1.8, edgecolor=COL_BORDER, facecolor="#FAFAFA")
    ax.add_patch(phone)
    ax.text(50, 99, title, ha="center", fontsize=11, weight="bold")

def fig_3_10_ui_home():
    fig, ax = new_fig(7, 11)
    draw_phone_frame(ax, "Figure 3.10: UI Diagram — Home View")
    box(ax, 8, 90, 84, 5, "Header: Temariware | Lang picker", fill="#E8E8E8", fontsize=9, bold=True)
    box(ax, 10, 84, 80, 4, "Search bar (debounced)", fill="white", fontsize=9, align="left")
    box(ax, 10, 78, 20, 3, "Filter chip", fill="#E8E8E8", fontsize=8)
    box(ax, 32, 78, 20, 3, "Subject chip", fill="#E8E8E8", fontsize=8)
    box(ax, 54, 78, 20, 3, "Location chip", fill="#E8E8E8", fontsize=8)
    for i in range(5):
        y = 70 - i*11
        box(ax, 10, y-4, 80, 9, "", fill="white", fontsize=8)
        ax.text(12, y+3, f"Job card {i+1}: Title | subjects | location | salary | deadline", fontsize=8, ha="left")
    box(ax, 8, 8, 84, 5, "Bottom nav: Jobs | Post | Apps | Profile", fill="#E8E8E8", fontsize=9, bold=True)
    save(fig, "figure_3_10_ui_home.png")

def fig_3_11_ui_detail():
    fig, ax = new_fig(7, 11)
    draw_phone_frame(ax, "Figure 3.11: UI Diagram — Job Detail View")
    box(ax, 8, 90, 84, 4, "← Back", fill="#E8E8E8", fontsize=9)
    box(ax, 10, 84, 80, 6, "Job Title (24pt bold) + badges", fill="white", fontsize=9, bold=True)
    box(ax, 10, 78, 80, 5, "Employer row: avatar + name + verified ✓", fill="white", fontsize=9, align="left")
    box(ax, 10, 70, 80, 6, "Facts grid (2×4):\nSubjects | Location | Type | Salary | Schedule | Grade | Gender | Deadline", fill="#F5F5F5", fontsize=8, align="left")
    box(ax, 10, 60, 80, 8, "Description card (full text)", fill="white", fontsize=9, align="left")
    box(ax, 10, 50, 80, 4, "Applicants count | relative date", fill="#F5F5F5", fontsize=8, align="left")
    box(ax, 10, 38, 80, 10, "Apply card:\n[message textarea]\n[Cancel] [Apply now]", fill="#FFF8DC", fontsize=9)
    box(ax, 8, 8, 84, 5, "Bottom nav", fill="#E8E8E8", fontsize=9, bold=True)
    save(fig, "figure_3_11_ui_detail.png")

def fig_3_12_ui_post():
    fig, ax = new_fig(7, 11)
    draw_phone_frame(ax, "Figure 3.12: UI Diagram — Post Job View")
    box(ax, 8, 90, 84, 5, "Employer badge | Title", fill="#E8E8E8", fontsize=9, bold=True)
    box(ax, 10, 84, 80, 4, "Fee notice: 500 ETB + payment instructions", fill="#E1F5FE", fontsize=8, align="left")
    box(ax, 10, 76, 80, 6, "Form: title, description, subjects, grade", fill="white", fontsize=9, align="left")
    box(ax, 10, 68, 80, 6, "Form: location, workType, salary, schedule", fill="white", fontsize=9, align="left")
    box(ax, 10, 60, 80, 6, "Form: gender, language, deadline, contact", fill="white", fontsize=9, align="left")
    box(ax, 10, 52, 80, 5, "Positions available (number input)", fill="white", fontsize=9, align="left")
    box(ax, 10, 44, 80, 5, "Application fee (per-job, ETB)", fill="white", fontsize=9, align="left")
    box(ax, 10, 32, 80, 10, "Payment screenshot uploader\n[file picker → preview → remove]", fill="#FFF8DC", fontsize=9)
    box(ax, 10, 22, 80, 5, "[Submit for review button]", fill="#E8E8E8", fontsize=9, bold=True)
    box(ax, 8, 8, 84, 5, "Bottom nav", fill="#E8E8E8", fontsize=9, bold=True)
    save(fig, "figure_3_12_ui_post.png")

def fig_3_13_ui_apps():
    fig, ax = new_fig(7, 11)
    draw_phone_frame(ax, "Figure 3.13: UI Diagram — Applications View")
    box(ax, 8, 90, 84, 5, "Title: My applications", fill="#E8E8E8", fontsize=9, bold=True)
    box(ax, 10, 84, 40, 4, "Applicants tab (badge)", fill="#E1F5FE", fontsize=9, bold=True)
    box(ax, 52, 84, 38, 4, "My applications tab", fill="white", fontsize=9)
    # Applicant cards
    for i in range(4):
        y = 74 - i*14
        box(ax, 10, y-5, 80, 11, "", fill="white", fontsize=8)
        ax.text(12, y+3, f"Applicant card {i+1}:", fontsize=9, weight="bold", ha="left")
        ax.text(12, y, "avatar + name + status badge", fontsize=8, ha="left", color="#666")
        ax.text(12, y-2.5, "university + field + year | positions filled", fontsize=8, ha="left", color="#666")
        ax.text(12, y-4, "[Accept] [Reject] buttons", fontsize=8, ha="left", weight="bold")
    box(ax, 8, 8, 84, 5, "Bottom nav", fill="#E8E8E8", fontsize=9, bold=True)
    save(fig, "figure_3_13_ui_apps.png")

def fig_3_14_ui_profile():
    fig, ax = new_fig(7, 11)
    draw_phone_frame(ax, "Figure 3.14: UI Diagram — Profile View")
    box(ax, 8, 90, 84, 6, "Avatar + Name + Role + Verification badge", fill="#E8E8E8", fontsize=9, bold=True)
    box(ax, 10, 82, 80, 5, "Language picker (EN/AM/OR)", fill="white", fontsize=9, align="left")
    box(ax, 10, 74, 80, 5, "Verify my company CTA (if unverified)", fill="#FFF8DC", fontsize=9, align="left")
    box(ax, 10, 64, 80, 8, "Profile form:\nfullName, phone, bio, CV link", fill="white", fontsize=9, align="left")
    box(ax, 10, 52, 80, 8, "University form:\nuniversity, fieldOfStudy, year", fill="white", fontsize=9, align="left")
    box(ax, 10, 36, 80, 14, "Required Documents:\n• National ID (number + image)\n• University ID (number + image)\n• Last semester grade report (image)", fill="#FFE4B5", fontsize=9, align="left")
    box(ax, 10, 26, 80, 6, "Job alerts:\nalert subjects + alert locations", fill="white", fontsize=9, align="left")
    box(ax, 10, 18, 80, 4, "[Save profile]", fill="#E8E8E8", fontsize=9, bold=True)
    box(ax, 8, 8, 84, 5, "Bottom nav", fill="#E8E8E8", fontsize=9, bold=True)
    save(fig, "figure_3_14_ui_profile.png")

def fig_3_15_ui_admin():
    fig, ax = new_fig(7, 11)
    draw_phone_frame(ax, "Figure 3.15: UI Diagram — Admin View")
    box(ax, 8, 90, 84, 5, "Title: Admin panel", fill="#E8E8E8", fontsize=9, bold=True)
    # 5-tab strip
    tabs = ["Jobs", "Payments", "Verify", "Settings", "Stats"]
    for i, t in enumerate(tabs):
        x = 10 + i*16
        box(ax, x, 84, 15, 4, t, fill="#E1F5FE" if i==0 else "#E8E8E8", fontsize=8, bold=(i==0))
    # Pending job card with screenshot
    box(ax, 10, 74, 80, 8, "Pending job card:\ntitle + employer + description + tags", fill="white", fontsize=9, align="left")
    box(ax, 10, 64, 80, 8, "Payment screenshot preview (image)", fill="#F5F5F5", fontsize=9, align="left")
    box(ax, 10, 56, 80, 5, "[Approve] [Reject (with reason)]", fill="#E8E8E8", fontsize=9, bold=True)
    # Stats row
    for i, label in enumerate(["Users", "Jobs", "Pending", "Apps"]):
        x = 10 + i*20
        box(ax, x, 40, 18, 10, f"{label}\nstat", fill="#F5F5F5", fontsize=9, bold=True)
    box(ax, 8, 8, 84, 5, "Bottom nav", fill="#E8E8E8", fontsize=9, bold=True)
    save(fig, "figure_3_15_ui_admin.png")

# ============================================================================
# MAIN — generate all
# ============================================================================

if __name__ == "__main__":
    print("Generating Temariware senior project diagrams...")
    fig_2_1_use_case()
    fig_2_2_class_model()
    fig_2_3_sequence_apply()
    fig_2_4_activity_job_flow()
    fig_2_5_ui_home()
    fig_2_6_ui_flow()
    fig_2_10_sequence_accept_pay()
    fig_2_11_sequence_approve_broadcast()
    fig_2_13_activity_app_lifecycle()
    fig_3_1_class_type()
    fig_3_2_component()
    fig_3_3_deployment()
    fig_3_4_persistent()
    fig_3_5_design_class()
    fig_3_6_collab_apply()
    fig_3_7_collab_post_pay()
    fig_3_8_collab_hire()
    fig_3_9_state_chart()
    fig_3_10_ui_home()
    fig_3_11_ui_detail()
    fig_3_12_ui_post()
    fig_3_13_ui_apps()
    fig_3_14_ui_profile()
    fig_3_15_ui_admin()
    print(f"\n✓ All diagrams saved to {FIG_DIR}/")
    print(f"  Total: {len(os.listdir(FIG_DIR))} files")
