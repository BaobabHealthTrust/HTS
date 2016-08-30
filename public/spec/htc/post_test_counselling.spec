P.1. POST TEST COUNSELLING [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]

Q.1.2. Page Loader [pos::0 $$ condition::loadPost()]

Q.1.4. Referral for Re-Testing [pos:: 3$$ type::hidden $$ id:: referral]

Q.1.5. Appointment Date Given [pos:: 4$$ id:: appointment$$ field_type:: date]

Q.1.6. HTS Family Referral Slips Given [pos:: 5$$ concept:: HTS Family Referral Slips$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal$$ id:: slips]

Q.1.7. Male Condoms [pos:: 6$$ condition:: evalCondition(6) && isNotInfant() $$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal$$ id:: male]

Q.1.8. Female Condoms [pos:: 7$$ condition:: evalCondition(7) && isNotInfant()$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal$$ id:: female]

Q.1.9. Comments [pos:: 8$$ optional:: true$$ field_type:: textarea$$ id:: comments]

Q.1.10. Summary [pos:: 9$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard$$ tt_onLoad:: showPostSummary()]