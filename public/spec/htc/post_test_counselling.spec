P.1. POST TEST COUNSELLING [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]

Q.1.2. Page Loader [pos::0 $$ condition::loadPost()]

Q.1.4. Referral for Re-Testing [pos:: 3$$ type::hidden $$ id:: referral]

Q.1.5. Appointment Date Given [pos :: 4$$ id :: appointment $$ field_type :: date $$ tt_onLoad :: setAppointment() $$ tt_onUnLoad :: validateAppointment()]

Q.1.6. HTS Family Referral Slips Given [pos:: 5$$ concept:: HTS Family Referral Slips$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal$$ id:: slips]

Q.1.7. Condom Type [pos::6 $$ id :: condom_type $$ condition :: isNotInfant() ]
O.1.7.1. Female
O.1.7.2. Male
O.1.7.3. Both
O.1.7.4. None

Q.1.8. Male Condoms [pos:: 7$$ condition:: (__$("condom_type").value=="Both" ||__$("condom_type").value=="Male") $$ field_type:: number$$ tt_pageStyleClass:: NumbersOnly$$ id:: male]

Q.1.9. Female Condoms [pos:: 8$$ condition:: (__$("condom_type").value=="Both" ||__$("condom_type").value=="Female")  && isNotInfant()$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnly$$ id:: female]

Q.1.10. Comments [pos:: 9$$ optional:: true$$ field_type:: textarea$$ id:: comments]

Q.1.11. Summary [pos:: 10$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard$$ tt_onLoad:: showPostSummary()]